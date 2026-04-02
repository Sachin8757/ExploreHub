const mongoose=require('mongoose');
const userschema=new mongoose.Schema({
    name:String,
    phone:String,
    password:String,
    listing:[
        {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    }
    ]
})

const User=mongoose.model("User",userschema);
module.exports = User; 