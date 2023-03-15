const { Router } = require("express");
const { messageModel } = require("../Models/messageModel");

const messageRouter = Router();

messageRouter.get("/allmsg/:id", async(req, res) => {
    let ID=req.params.id;
    try {
        let to = await messageModel.find({to:ID});
        let from = await messageModel.find({from:ID});
        res.send({ "message": "all messages", "to":to, "from":from });
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

messageRouter.post("/send", async(req, res) => {
    let data = req.body;
    try {
        let time=new Date();
        data.time=[time.getHours(),time.getMinutes(),time.getSeconds()];
        data.date=[time.getDate(),time.getMonth()+1,time.getFullYear()];
        let rep = new messageModel(data);
        await rep.save();
        res.send({ "message": "sended" });
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

messageRouter.delete("/delete/:id", async(req, res) => {
    let ID=req.params.id;
    try {
        await messageModel.findByIdAndDelete({_id:ID});
        res.send({ "message": "deleted" });
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});


module.exports={messageRouter};