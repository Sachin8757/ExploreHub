const express=require('express')
const route=express.Router();
const wrapAsynce=require("../util/wrapAsynce.js")
const ExpressError=require("../util/ExpressError.js")
const {listingSchema}=require("../model/schema.js")
const Listing=require("../model/listing.js")
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer  = require('multer')
const{storage}=require('../cloudConfig.js')
const upload = multer({storage})


// //listing page
route.get("/",wrapAsynce(listingController.index))
// //new route
route.get("/new",isLoggedIn,wrapAsynce(listingController.renderform))

route.post("/new",isLoggedIn,upload.single('listing[image]'),(listingController.createform))

// //show route
route.get("/:id",wrapAsynce(listingController.listindeatils))
// //edit route
route.get("/:id/edit",isLoggedIn,isOwner,wrapAsynce(listingController.editform))

route.patch("/edit/:id",isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsynce(listingController.editpostform))

// //delete route
route.delete("/:id",isLoggedIn,isOwner,wrapAsynce(listingController.deletelisting))
module.exports=route;