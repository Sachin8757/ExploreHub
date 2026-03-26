const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
    title:String,
    image:String,
    location:String,
    state:String,
    country:String,
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }
    ]
})

const Listing=mongoose.model("Listing",userschema);
module.exports = Listing; 