const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose')
const { string } = require('joi');
//user schema
const userSchema=new Schema({
    email:{
        type:String,
        require:true
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("user",userSchema);






