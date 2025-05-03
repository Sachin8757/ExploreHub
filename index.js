if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const MongoStore = require('connect-mongo');
const port = process.env.PORT || 4000;
const express=require('express')
const app=express();
const mongoose=require("./model/connection.js")
const path=require('path')
var methodoverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require("./util/ExpressError.js")
const cookiepaser=require('cookie-parser');
const session=require('express-session')
const flsah=require('connect-flash')
const { Cookie } = require('express-session');
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const passport=require('passport')
const LocaStrategy=require('passport-local')
const User=require("./model/user.js");



app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(methodoverride('_method'));
app.set("views engin","/views")
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate);


const store=MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
        secret:process.env.Secret,
        touchAfter:24*3600,
    }
})
store.on("error",()=>{
    console.log("error in mongo session store",error)
})
const sessionoption={
    store,
    secret:process.env.Secret,
    resave:false,
    saveUninitialized:true,
    Cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

// // index route
app.get("/",async(req,res)=>{
    res.redirect("/listing")
    
})
app.use(session(sessionoption))
app.use(flsah());
//user login logout 
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocaStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next();
})

app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter)
app.use("/",userRouter)

app.all("*",(req,res,next)=>{
    next(new ExpressError(400,"page not found!")) 
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err})
})

app.use(session({
  store: MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL
  }),
  secret: process.env.Secret,
  resave: false,
  saveUninitialized: true
}));

app.listen(port, () => {
    console.log(`running...`)

  })
