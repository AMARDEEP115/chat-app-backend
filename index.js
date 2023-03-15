const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const { SocketMiddleware }=require("./Middleware/Socket.Middleware");
const { messageRouter } = require("./Router/messageRouter");
const { userRouter } = require("./Router/userRouter");
const { connection } = require("./Config/db");
const cors=require("cors");
require("dotenv").config();

const app=express();

const httpServer=http.createServer(app);

const io=new Server(httpServer);

app.use(express.json());
app.use(cors({
    origin:"*",
}));


app.get("/",(req,res)=>{
    res.send("Home");
});

let activeUsers=[];


app.use("/user",userRouter);
app.use("/message",messageRouter);

app.use(SocketMiddleware);

io.on("connection",(socket)=>{
    console.log("user connected");
    socket.on("userID",(data)=>{
        let check=activeUsers.filter((el)=>el.userID===data);
        if(check.length===1){
            activeUsers.forEach((el)=>{
                if(el.userID===data){
                    el.socketID=socket.id;
                }
            });
        } else {
            activeUsers.push({userID:data,socketID:socket.id});
        }
        console.log("all users connected");
        socket.emit("activeUsers",activeUsers);
    });
    socket.on("message",(msg)=>{
        let sendTo=activeUsers.filter((el)=>el.userID===msg.to);
        console.log("message",msg);
        console.log(sendTo);
        if(sendTo.length>0){
            socket.to(sendTo[0].socketID).emit("message",{messages:msg.message,from:msg.from});
        }
    });
    socket.on("disconnect",(cc)=>{
        activeUsers=activeUsers.filter((el)=>el.socketID!==socket.id);
        console.log("user disconnected");
        socket.emit("activeUsers",activeUsers);
    });
});

httpServer.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("Connected to DB");
    } catch(err){
        console.log(err);
        console.log("Not-Connected to DB");
    }
    console.log(`server is running at port ${process.env.port}`);
});
