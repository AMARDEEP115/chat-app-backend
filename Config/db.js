const mongoose=require("mongoose");
require("dotenv").config();

const connection=mongoose.connect(process.env.mongoURL || "mongodb+srv://AmarDeep:AmarTalkDeep@cluster0.sj6zn4j.mongodb.net/knock-talk?retryWrites=true&w=majority");

module.exports={connection};