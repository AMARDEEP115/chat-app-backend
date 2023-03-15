const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    mobile:Number,
    photo:String,
    password:String,
    friends:Array,
    friend_request:Array,
    friend_request_sent:Array,
});

const userModel=mongoose.model("users",userSchema);

module.exports={userModel};