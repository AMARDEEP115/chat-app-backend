const mongoose=require("mongoose");

const messageSchema=mongoose.Schema({
    to:String,
    from:String,
    message:String,
    time:Array,
    date:Array
});

const messageModel=mongoose.model("messages",messageSchema);

module.exports={messageModel};