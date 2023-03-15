const { Router } = require("express");
const { userModel } = require("../Models/userModel");

const userRouter = Router();

userRouter.post("/register", async(req, res) => {
    let data = req.body;
    if(data.photo===undefined || data.photo===""){
        data.photo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnO4Gbe_zOUld75wAOEA6YdJqw5pXed1-2weosIbFRC6IvD9KnmOF8adGJn6lapLFt4-M&usqp=CAU";
    }
    if(data.friends===undefined){
        data.friends=[];
    }
    if(data.friend_request===undefined){
        data.friend_request=[];
    }
    if(data.friend_request_sent===undefined){
        data.friend_request_sent=[];
    }
    try {
        let fUser=await userModel.find({$or:[{name:data.name},{email:data.email}]});
        if(fUser.length===0){
            let resp =new userModel(data);
            await resp.save();
            res.send({ "message": "Register Succesfully" });
        } else {
            res.send({ "message": "User already present" });
        }
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

userRouter.post("/login", async(req, res) => {
    let data = req.body;
    try {
        let users=await userModel.find({name:data.name});
        if(users.length>0){
            if(users[0].password===data.password){
                res.send({"message":"Login succesfully","user":users[0]});
            } else {
                res.send({ "message": "Wrong Password" });
            }
        } else {
            res.send({ "message": "No users found" });
        }
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

userRouter.patch("/change/:id",async(req,res)=>{
    let ID=req.params.id;
    let pss=req.headers.authorization;
    let data=req.body;
    try{
        let user=await userModel.findById({_id:ID});
        if(user){
            if(user.password===pss){
                await userModel.findByIdAndUpdate({_id:ID},data);
                res.send({"message":"User Updated"});
            } else {
                res.send({"message":"Wrong Password"});
            }
        } else {
            res.send({"message":"Something went wrong"});    
        }
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

userRouter.get("/", async(req, res) => {
    try {
        let reps =await userModel.find();
        res.send({ "message": "all users","users":reps });
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

userRouter.get("/singleuser/:id", async(req, res) => {
    let ID=req.params.id;
    try {
        let user =await userModel.findById({_id:ID});
        res.send({ "message": "single user","user":user });
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

userRouter.post("/requestfriend", async(req, res) => {
    let data=req.body;
    try {
        let to=data.to;
        let from=data.from;
        let tos =await userModel.findById({_id:to});
        let froms =await userModel.findById({_id:from});
        let frS=[...froms.friend_request_sent,to];
        await userModel.findByIdAndUpdate({_id:from},{friend_request_sent:frS});
        let frR=[...tos.friend_request,from];
        await userModel.findByIdAndUpdate({_id:to},{friend_request:frR});
        res.send({ "message": "friend Request Sent"});
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

userRouter.post("/canclefriendrequest", async(req, res) => {
    let data=req.body;
    try {
        let to=data.to;
        let from=data.from;
        let tos =await userModel.findById({_id:to});
        let froms =await userModel.findById({_id:from});
        let frF=froms.friend_request_sent.filter((el)=>el!==to);
        await userModel.findByIdAndUpdate({_id:from},{friend_request_sent:frF});
        let frT=tos.friend_request.filter((el)=>el!==from);
        await userModel.findByIdAndUpdate({_id:to},{friend_request:frT});
        res.send({ "message": "Cancled Friend Request"});
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

userRouter.post("/acceptfriend", async(req, res) => {
    let data=req.body;
    try {
        let user=data.user;
        let from=data.from;
        let tos =await userModel.findById({_id:user});
        let froms =await userModel.findById({_id:from});
        let frRF=[...tos.friends,from];
        await userModel.findByIdAndUpdate({_id:user},{friends:frRF});
        let frRS=[...froms.friends,user];
        await userModel.findByIdAndUpdate({_id:from},{friends:frRS});
        let frR=tos.friend_request.filter((el)=>el!==from);
        await userModel.findByIdAndUpdate({_id:user},{friend_request:frR});
        let frF=froms.friend_request_sent.filter((el)=>el!==user);
        await userModel.findByIdAndUpdate({_id:from},{friend_request_sent:frF});
        res.send({ "message": "friend Request Accepted"});
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});

userRouter.post("/removefriend", async(req, res) => {
    let data=req.body;
    try {
        let user=data.user;
        let from=data.from;
        let tos =await userModel.findById({_id:user});
        let froms =await userModel.findById({_id:from});
        let frRF=tos.friends.filter((el)=>el!==from);
        await userModel.findByIdAndUpdate({_id:user},{friends:frRF});
        let frRS=froms.friends.filter((el)=>el!==user);
        await userModel.findByIdAndUpdate({_id:from},{friends:frRS});
        res.send({ "message": "friend Removed"});
    } catch(err){
        console.log(err);
        res.send({"message":"Something went wrong"});
    }
});



module.exports={userRouter};