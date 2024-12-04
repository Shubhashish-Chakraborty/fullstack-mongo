const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');

const { UserModel } = require('./db')
const {auth , JWT_SECRET} = require("./auth");

const PORT = 3000;
const app = express();
app.use(express.json());

// Connecting to MongoDB Database!
mongoose.connect("mongodb+srv://shubhashish:3xagFSuuywuVj67F@cluster0.sqhio.mongodb.net/todo-app-test");

app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname, "../frontend/frontend.html"));
})

// Signup
app.post('/signup' , async (req , res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    await UserModel.create({
        username: username,
        email: email,
        password: password
    })

    res.json({
        msg: `${username} SuccessFully SignedUP!!`
    })
})


// SignIN/LogIN
app.post("/signin" , async (req , res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password: password
    })

    if (!user) { // If User Not Found!!
        res.status(403).json({
            message: "User Not Found, Incorrect Credentials!!"
        });
    }
    else { // IF user found -> allot a JWT and login
        const token = jwt.sign({
            id: user._id.toString()
        } , JWT_SECRET);
        
        res.json({
            msg: `${user.username} successfully LoggedIN!!`,
            token: token
        })
    }
})



app.listen(PORT);