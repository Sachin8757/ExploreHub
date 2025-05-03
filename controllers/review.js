const Listing=require('../model/listing.js')
const Review=require('../model/review.js')
const ExpressError=require('../util/ExpressError.js')
const {reviewSchema}=require("../model/schema.js")
module.exports.createreview=async(req,res)=>{
    const {id}=req.params;
    let result=reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error)
    }
    const listing= await Listing.findById(id);
    const newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    await listing.review.push(newreview);
    await listing.save();
    await newreview.save();
    req.flash("success","review created!");
    res.redirect(`/listing/${id}`)
}

module.exports.deletereview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted!");
    res.redirect(`/listing/${id}`);
}