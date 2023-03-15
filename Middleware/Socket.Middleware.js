// const {io}=require("../index");

const SocketMiddleware=(req,res,next)=>{
    let url=req.url;
    console.log(url);
    if(url==="/user/login"){
        next();
    }
}

module.exports={SocketMiddleware};