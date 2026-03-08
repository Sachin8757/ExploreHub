const express=require('express');
const isLogin=require("../middleware/islogin.js")
const User=require("../models/user.js")

const app=express();

app.get("/listing",isLogin,async(req,res)=>{
    const id=req.session.userId;
    const user=await User.findById(id);
    res.send("whelcome to listing In this page we show our all wandering location ");
})

module.exports=app;