const mongoose=require('mongoose');
const review = require('./review');
const { listingSchema } = require('./schema');
const { string, defaults } = require('joi');

const Schema=mongoose.Schema;

const ListingSchema=new Schema({
    title:String,
    description:String,
    price:Number,
    location:String,
    country:String,
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review"

    }],
    image:{
        url:String,
        filename:String,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
})
ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.review}})
    }
})
const Listing =mongoose.model("Listing",ListingSchema)
module.exports=Listing; 