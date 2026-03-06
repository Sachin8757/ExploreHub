const express=require('express');

const app=express();

app.get("/listing",(req,res)=>{
    res.send("whelcome to listing In this page we show our all wandering location ");
})

module.exports=app;