const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
    title:String
})

const Listing=mongoose.model("Listing",userschema);
module.exports = Listing; 