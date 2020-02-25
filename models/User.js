const mongoose = require('mongoose');
const Jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({

    name:{
        required:true,
        type:String,
        minlength:6,
        maxlength:50
    },

    email:{
        type:String,
        required:true,
        unique:true,
        minlength:5,
        maxlength:255
    },  

    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
    },

    isAdmin:{
        type:Boolean,
        default:false
    }
});

userSchema.methods.generateToken = function(){
    return Jwt.sign({_id: this._id, name: this.name, isAdmin: this.isAdmin},process.env.JWT_SECRET_KEY);
}
const User = mongoose.model("User", userSchema);
module.exports = User;