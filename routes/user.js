const express = require('express')
const route = express.Router();
const User = require("../model/user.js")
const wrapAsynce = require("../util/wrapAsynce.js")
const passport=require('passport')
const {saveRedirectUrl}=require('../middleware.js')
const userController=require('../controllers/user.js')

//reginster route
route.get("/signup",userController.rendersign)
route.post("/signup", wrapAsynce(userController.signup))

//login route
route.get("/login",userController.login
    
)
route.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),userController.loginpost)

//logout

route.get("/logout",userController.logoutuser)
module.exports = route;