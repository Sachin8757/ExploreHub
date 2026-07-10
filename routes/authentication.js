require("dotenv").config();
const express=require('express');
const app=express();
const bcrypt = require("bcrypt");
const User=require("../models/user.js"); //requre user schema for login and reginster form models folder
const isLogin = require("../middleware/islogin.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js")
const nodemailer = require("nodemailer");


// this is transporter nodemailer function
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// this is otp generator funtion
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

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
    const { email, password } = req.body;
   
    const user = await User.findOne({ email });
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
// welcome mail body
async function sendWelcomeEmail(name, email) {
    await transporter.sendMail({
        from: `"ExpressHub Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🎉 Welcome to ExpressHub",
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px;">
            <h2>Hello ${name} 👋</h2>

            <p>Welcome to <strong>ExpressHub</strong>!</p>

            <p>Your account has been created successfully.</p>

            <ul>
                <li>✅ Explore listings</li>
                <li>✅ Manage your profile</li>
                <li>✅ Enjoy all platform features</li>
            </ul>

            <p>We're excited to have you with us.</p>

            <hr>

            <p style="color:gray;">
                Thanks,<br>
                <strong>ExpressHub Team</strong>
            </p>
        </div>
        `
    });
}

app.post("/listing/register/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // res.send({name,email,password})


        // 1. Validation
        if (!name || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        // 2. Check existing user
        const existingUser = await User.findOne({email:email})
        if (existingUser) {
            return res.status(400).send("User already registered");
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Save user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        // send welcome mail 
        try {
        await sendWelcomeEmail(user.name, user.email);
        } catch (err) {
        console.log("Email could not be sent:", err.message);
        }
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

// this is password forget route
app.get("/listing/login/login/forget", async (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).send("Email is required");
    }

    const otp = generateOTP();
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            html: `
                <h2>Password Reset</h2>
                <p>Your OTP is:</p>
                <h1 style="color:blue;">${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
            `,
        });
        // TODO: Save the OTP in your database or session
        // Example:
        // user.resetOTP = otp;
        // user.otpExpiry = Date.now() + 5 * 60 * 1000;

        res.render("forget.ejs")
    } catch (err) {
        res.status(500).send("Failed to send OTP");
    }
});




module.exports=app;