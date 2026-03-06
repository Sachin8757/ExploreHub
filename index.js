// This is our main folder where i write all  main backend code 
// To run our project first write on console npx nodemon
require("dotenv").config({ quiet: true }); //config .env file for store your secret code and url of db
const express=require('express');//require express for backend 
const app=express(); // call express 
const connection=require('./models/connection.js')
const PORT=3000; //this is the port number where our project running
const engine = require("ejs-mate"); //require ejs mate 
const path=require('path') //require path
const listing=require('./routes/listing.js');//require listing.js file from routes folder
const authentication=require('./routes/authentication.js'); // require authentication.js file from routes folder

//########### These all are middleware #######################
app.engine("ejs", engine); //set ejs engine
app.set("view engine", "ejs"); //set ejs engine
app.set("views", path.join(__dirname, "views")); // 🔹 Set views folder path (optional but recommended)
app.use(express.static(path.join(__dirname, "public"))); // 🔹 Setup public folder (for css, js, images)
app.use(express.urlencoded({ extended: true }));



app.use('/',listing)//call all function of listing files
app.use('/',authentication)//call all function of authentication files

app.get("/",(req,res)=>{
    res.render("Home.ejs"); //this is Home route 
})


app.listen(PORT,(req,res)=>{ // this is function which help to run our server on port
    console.log("server running..."); //this line print our server runnign now on console
})