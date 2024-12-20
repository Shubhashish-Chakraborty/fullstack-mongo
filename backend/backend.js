require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require("bcrypt");

const { UserModel , TodoModel } = require('./db')
const {auth , JWT_SECRET} = require("./auth");

const app = express();
app.use(express.json());

// Connecting to MongoDB Database!
mongoose.connect(process.env.MONGO_URL);

app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname, "../frontend/frontend.html"));
})

// Signup
app.post('/signup' , async (req , res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    let errorFound = false;
    try {
        const hashedPassword = await bcrypt.hash(password , 8);
    
        await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword
        })
    }
    catch (e) {
        res.status(403).json({
            msg: `User already exists with email: ${email}`
        })
        errorFound = true;
    }

    if (!errorFound) { // If any error didn't occured!
        res.json({
            msg: `${username} SuccessFully SignedUP!!`
        })
    }

})


// SignIN/LogIN
app.post("/signin" , async (req , res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
    })

    if (!user) { // If User Not Found!!
        res.status(403).json({
            msg: `User with email:${email} does not exists in our database!`
        });
        return
    }

    // generating the hashed password and comparing it with the database's stored password!

    const passwordMatched = await bcrypt.compare(password , user.password);
    if (!passwordMatched) {
        res.status(403).json({
            message: "User Not Found, Incorrect Credentials Provided!!!"
        });
    }
    else {
        const token = jwt.sign({
            id: user._id.toString()
        } , JWT_SECRET);
        
        res.json({
            msg: `${user.username} successfully LoggedIN!!`,
            username: user.username,
            token: token
        })
    }
})

// Authenticated endpoint || Adding Todo to database!
app.post('/add-todo' , auth , async (req ,res) => {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;
    
    await TodoModel.create({
        title: title,
        done: done,
        userId: userId
    })

    const user = await UserModel.findOne({
        _id: userId
    })

    res.json({
        msg: `${user.username}'s Todo Successfully Added!`
    })

})

// Authenticated Endpoint || Displaying the Todo Associated to the User on frontend!
app.post('/show-todo', auth , async (req , res) => {
    const userId = req.userId;

    const todos = await TodoModel.find({ // this will be an array containing all the tasks of that user! []
        userId: userId // Uss particular User ke todos show karega!!
    });

    const user = await UserModel.findOne({
        _id: userId // Uss particular User ke details!
    })

    let finalResponse = {
        todoData: todos,
        username: user.username,
        email: user.email
    }

    res.json(finalResponse);

    // {
    //     todoData: [
    //       {
    //         _id: new ObjectId('675032ff265fd4af137dba4a'),
    //         title: 'shubh task',
    //         done: true,
    //         userId: new ObjectId('675032ed265fd4af137dba47'),
    //         __v: 0
    //       },
    //       {
    //         _id: new ObjectId('6750376bb458d3f6d31f42a5'),
    //         title: 'shubh task2',
    //         done: false,
    //         userId: new ObjectId('675032ed265fd4af137dba47'),
    //         __v: 0
    //       }
    //     ],
    //     username: 'shubh',
    //     email: 'shubh@gmail.com'
    // }

})
app.listen(process.env.PORT);