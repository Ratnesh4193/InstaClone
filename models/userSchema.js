const mongoose = require("mongoose");
const {ObjectId}=mongoose.Schema.Types



var userSchema=new mongoose.Schema({
    name:{type:String,required:true},       
    email:{type:String,required:true},
    password:{type:String,required:true},
    profilePic:{type:String,default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJETLjaeEGteeWMrEWSlfslFi1A0v2TDXoEg&usqp=CAU"},
    resetToken:String,
    expireToken:Date,
    followers:[{type:ObjectId,    ref:"User"}],
    following:[{type:ObjectId,    ref:"User"}],

    
})

mongoose.model("User",userSchema);
