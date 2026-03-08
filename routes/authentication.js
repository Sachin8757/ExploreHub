require("dotenv").config();
const express=require('express');
const app=express();
const bcrypt = require("bcrypt");
const User=require("../models/user.js"); //requre user schema for login and reginster form models folder
const isLogin = require("../middleware/islogin.js");

// this is user won route in this route user see about ownself
app.get("/listing/user",isLogin,async(req,res)=>{
        const id=req.session.userId;
        const CURRUSER=await User.findById(id);
        const userId = req.query.id;
        const user=await User.findById(userId)
        res.render("aboutuser.ejs",{user,CURRUSER})
})
// this is login part
app.get('/listing/login',async(req,res)=>{
    const id=req.session.userId;
    const CURRUSER=await User.findById(id);
    res.render("login.ejs",{CURRUSER})
})
app.post("/listing/login", async (req, res) => {
    const { phone, password } = req.body;
    

    const user = await User.findOne({ phone });
    if (!user) {
        return res.send("User not found");
    }
        // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.send("Wrong password");
    }

    // login success
    req.session.userId = user._id;  // ✅ session created
    req.session.name = user.name;   
    res.redirect('/')
});


//this is register part
app.get('/listing/register',async(req,res)=>{
        const id=req.session.userId;
        const CURRUSER=await User.findById(id);
    res.render("register.ejs",{CURRUSER})
})
app.post("/listing/register", async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        console.log(req.body)
        // 1. Validation
        if (!name || !phone || !password) {
            return res.status(400).send("All fields are required");
        }

        // 2. Check existing user
        const existingUser = await User.findOne({phone:phone})
        if (existingUser) {
            return res.status(400).send("User already registered");
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Save user
        const user = new User({
            name,
            phone,
            password: hashedPassword
        });
        await user.save();
            // login success
    req.session.userId = user._id;   // ✅ session created
    req.session.name = user.name;
    res.redirect("/")
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

//this is logout part

app.get("/listing/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

// isLogin function


module.exports=app;