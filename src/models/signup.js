const mongoose = require("mongoose");

const elearningSchema = new mongoose.Schema({
    fullName : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:[true,"This email have already been registered"]
    },
    gender:{
        type:String,
        required:true
    },
    course : {
        type:String,
        required : true
    },
    password : {
        type:String,
        required:true
    },
    confirmpass : {
        type:String,
        required:true
    }
})

const SignUp = new mongoose.model("SignUp",elearningSchema);

module.exports = SignUp;