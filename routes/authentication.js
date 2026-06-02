require("dotenv").config();
const express=require('express');
const app=express();
const bcrypt = require("bcrypt");
const User=require("../models/user.js"); //requre user schema for login and reginster form models folder
const isLogin = require("../middleware/islogin.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js")

// this is user won route in this route user see about ownself
app.get("/listing/user/:id", isLogin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const listings = await Listing.find({ User: id });
        res.render("aboutuser.ejs", { user, listings });
    } catch (err) {
        res.send("Error loading user profile");
    }
});
// this is login part
app.get('/listing/login',async(req,res)=>{
    res.render("login.ejs")
})
app.post("/listing/login/login", async (req, res) => {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
        return res.redirect("/listing/register")
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
    res.render("register.ejs")
})
app.post("/listing/register/register", async (req, res) => {
    try {
        const { name, phone, password } = req.body;
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
app.get("/listing/logout",isLogin,(req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// Delete user Account 
app.post("/user/:id",isLogin, async (req, res) => {
    try {
        const { id } = req.params;
        // 🔐 Check login
        if (!req.session.userId) {
            // req.flash("error", "Please login first");
            return res.redirect("/login");
        }
        // 🔐 Check authorization
        if (req.session.userId.toString() !== id) {
            // req.flash("error", "Unauthorized action");
            return res.redirect("/listing"); 
        }
        // 🏠 Find user's listings
        const listings = await Listing.find({ User: id });
        const listingIds = listings.map(l => l._id);
        // 🧹 Delete reviews (FAST WAY)
        await Review.deleteMany({
            listing: { $in: listingIds }
        });
        // 🧹 Delete listings
        await Listing.deleteMany({ User: id });
        // 👤 Delete user
        await User.findByIdAndDelete(id);

        // 🔓 Logout (destroy session)
        req.session.destroy(() => {
            // req.flash("success", "Account deleted successfully!");
            res.redirect("/");
        });

    } catch (err) {
        console.log(err);
        // req.flash("error", "Something went wrong");
        res.redirect(`/listing/user/${id}`);
    }
});


module.exports=app;