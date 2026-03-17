const express=require('express');
const app=express();
const isLogin=require("../middleware/islogin.js")
const upload = require("../middleware/multer.js");
const Listing=require("../models/listing.js")
const User=require("../models/listing.js")

// All listing
app.get("/listing",isLogin,async(req,res)=>{
    // const id=req.session.userId;
    // const CURRUSER=await User.findById(id);

    const lis = await Listing.find();   // get data from MongoDB
    res.render("index.ejs", { lis});
})

// New Route
app.get("/listing/new",isLogin,(req,res)=>{
    res.render("new.ejs")
})
app.post("/upload",isLogin,upload.single("image"),async(req, res) => {
    const {title,location,city,state,country}=req.body;
    const userid=req.session.userId;
    const newlisting= await Listing({
        title:title,
        image:req.file.path,
        location:location,
        state:state,
        country:country,
        User:userid
    })
    newlisting.save();
    res.redirect("/listing")
});

//view details of listing
app.get("/listing/details/:id", isLogin, async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate("User");

    res.render("show.ejs", { listing});
});

module.exports=app;