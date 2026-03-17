// This is our main folder where i write all  main backend code 
// To run our project first write on console npx nodemon
require("dotenv").config({ quiet: true }); //config .env file for store your secret code and url of db
const express=require('express');//require express for backend 
const app=express(); // call express 
const connection=require('./models/connection.js')
const PORT=process.env.PORT; //this is the port number where our project running
const engine = require("ejs-mate"); //require ejs mate 
const path=require('path') //require path
const listing=require('./routes/listing.js');//require listing.js file from routes folder
const authentication=require('./routes/authentication.js'); // require authentication.js file from routes folder
const User=require("./models/user.js")
//this is some authentication requirement 
const MongoStore = require("connect-mongo").default;
const session = require("express-session");
const bcrypt = require("bcrypt");

//########### These all are middleware #######################
app.engine("ejs", engine); //set ejs engine
app.set("view engine", "ejs"); //set ejs engine
app.set("views", path.join(__dirname, "views")); // 🔹 Set views folder path (optional but recommended)
app.use(express.static(path.join(__dirname, "public"))); // 🔹 Setup public folder (for css, js, images)
app.use(express.urlencoded({ extended: true }));

//################## This is Sesstion Middleware ###########
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:process.env.DBURL,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use(async (req, res, next) => {
    const id = req.session.userId;

    if (id) {
        res.locals.CURRUSER = await User.findById(id);
    } else {
        res.locals.CURRUSER = null;
    }
    next(); // ✅ VERY IMPORTANT
});


app.use('/',listing)//call all function of listing files
app.use('/',authentication)//call all function of authentication files

app.get("/",async(req,res)=>{
    res.render("Home.ejs"); //this is Home route 
})

app.listen(PORT,(req,res)=>{ // this is function which help to run our server on port
    console.log(`server running on port No ${PORT}...`); //this line print our server runnign now on console
})