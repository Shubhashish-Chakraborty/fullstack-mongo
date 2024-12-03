const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');

const { UserModel } = require('./db')

const PORT = 3000;
const app = express();
app.use(express.json());

// Connecting to MongoDB Database!
mongoose.connect("mongodb+srv://shubhashish:3xagFSuuywuVj67F@cluster0.sqhio.mongodb.net/todo-app-test");

app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname, "../frontend/frontend.html"));
})

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




app.listen(PORT);