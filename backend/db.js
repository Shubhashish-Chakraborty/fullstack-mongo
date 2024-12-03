const mongoose = require("mongoose");
const { userInfo } = require("os");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

// Creating the UserSchema!

const User = new Schema({
    username: String,
    email: String,
    password: String
})

const UserModel = mongoose.model('users' , User);

module.exports = {
    UserModel: UserModel
}