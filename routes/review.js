const express=require('express')
const route=express.Router({mergeParams:true});
const wrapAsynce=require("../util/wrapAsynce.js")
const ExpressError=require("../util/ExpressError.js")
const Listing=require("../model/listing.js")
const {reviewSchema}=require("../model/schema.js")
const Review=require("../model/review.js")
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require('../controllers/review.js')

//review route
route.post("/",isLoggedIn,wrapAsynce(reviewController.createreview))

//delete reviews
route.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsynce(reviewController.deletereview))
module.exports=route;