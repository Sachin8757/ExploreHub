const Listing=require("../model/listing")
const {listingSchema}=require("../model/schema.js")
const multer  = require('multer')
const{storage}=require('../cloudConfig.js')
const upload = multer({storage})
const ExpressError=require("../util/ExpressError.js")

//index route
module.exports.index=(async(req,res)=>{
    const listing=await Listing.find();
    res.render("index.ejs",{listing});
    
})
//new route
module.exports.renderform=(req,res)=>{
    res.render("new.ejs");
}
module.exports.createform=(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let result=listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error)
    }
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.save();
    req.flash("success","listing created!");
    res.redirect("/")
}

//show route in deatils
module.exports.listindeatils=async(req,res)=>{
    const {id}=req.params;
    const lis=await Listing.findById(id).populate({path:"review",
        populate:{
            path:"author"
        },
    }).populate("owner");
    if(!lis){
        req.flash("error","listing is  not exist!");
        res.redirect("/listing")
    }
    res.render("show.ejs",{lis});
}

//edit route
module.exports.editform=async(req,res)=>{
    const {id}=req.params;
    const list=await Listing.findById(id);
    if(!list){
        req.flash("error","listing is  not exist!");
        res.redirect("/listing")
    }
    res.render("edit.ejs",{list})
}

module.exports.editpostform=async(req,res)=>{
    let result=listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error)
    }

    const {id}=req.params;
    const Newli=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        Newli.image={url,filename};
        await Newli.save();
    }
    req.flash("success","listing Updated!");
    res.redirect(`/listing/${id}`)
}

//delete route
module.exports.deletelisting=async(req,res)=>{
    const {id}=req.params;
    const deletlisting=await Listing.findByIdAndDelete(id);
    if(!deletlisting){
        req.flash("error","listing is  not exist!");
        res.redirect("/listing")
    }
    req.flash("success","listing deleted!");
    res.redirect("/listing")
}