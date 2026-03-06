require("dotenv").config();
const express=require('express');
const app=express();

app.get('/listing/login',(req,res)=>{
    res.send("hello on login page page on working");
})

module.exports=app;