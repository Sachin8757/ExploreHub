const express=require('express');
const app=express();
const isLogin=require("../middleware/islogin.js")
const upload = require("../middleware/multer.js");
const Listing=require("../models/listing.js")
const User=require("../models/listing.js")
const Review=require("../models/review.js")


// All listing
app.get("/listing",async(req,res)=>{
    const lis = await Listing.find().populate("reviews");   // get data from MongoDB
    res.render("index.ejs", { lis});
})

// New Route
app.get("/listing/new",isLogin,(req,res)=>{
    res.render("new.ejs")
})
app.post("/listing/new",isLogin,upload.single("image"),async(req, res) => {
    const {title,location,city,state,country}=req.body;
    const userid=req.session.userId;
    const newlisting= await Listing({
        title:title,
        image:req.file.path,
        location:location,
        state:state,
        country:country,
        User:userid
    })
    newlisting.save();
    res.redirect("/listing")
});

// About Page
app.get("/about",async(req,res)=>{
  const listings = await Listing.find();

  const totalListings = listings.length;
  const totalUsers =(await User.find()).length;

  const userGrowth = [30, 60, 90, 120];
  const listingPercent = Math.min((totalListings / 100) * 100, 100);

      res.render("about.ejs", {
        listings,
        chartData: {
          totalListings,
          totalUsers,
          userGrowth,
          listingPercent
        }
      });
})
// New Route
app.get("/edit/:id",isLogin,async(req,res)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        res.send("Place not found")
    }
    console.log(listing);
    res.render("edit.ejs",{listing})
})
app.post("/listing/edit/:id", isLogin, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, location, state, country } = req.body;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        // Update only if the user entered a value
        if (title && title.trim() !== "") {
            listing.title = title;
        }

        if (location && location.trim() !== "") {
            listing.location = location;
        }

        if (state && state.trim() !== "") {
            listing.state = state;
        }

        if (country && country.trim() !== "") {
            listing.country = country;
        }

        // Update image only if a new image is uploaded
        if (req.file) {
            listing.image = req.file.path;
        }

        await listing.save();

        res.redirect(`/listing/details/${id}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});
// this is calculate time 
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 }
  ];

  for (let i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count > 0) {
      return count + " " + i.label + (count > 1 ? "s" : "") + " ago";
    }
  }

  return "just now";
}

//view details of listing
app.get("/listing/details/:id",isLogin, async (req, res) => {
const listing = await Listing.findById(req.params.id)
  .populate({
    path: "reviews",
    options: { sort: { createdAt: -1 } }, // 🔥 latest first
    populate: { path: "user" }
  });

  res.render("show.ejs", { listing, timeAgo }); // ✅ pass function
});
    // delete route
app.get("/delete/:id",isLogin, async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})

 // search route
 app.get("/listing/search", async (req, res) => {
    try {
        const { query } = req.query;

        const listings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { location: { $regex: query, $options: "i" } },
                { state: { $regex: query, $options: "i" } },
                { country: { $regex: query, $options: "i" } }
            ]
        });

        res.render("search.ejs", { listings, query });

    } catch (err) {
        console.log(err);
        res.send("Search error");
    }
});
 // delete all post 
app.post("/listing/:id",isLogin, async (req, res) => {
    try {
        const { id } = req.params;
        // 🔐 Check login
        if (!req.session.userId) {
            // req.flash("error", "Please login first");
            return res.redirect("/login");  
        }
        // 🔐 Check authorization
        if (req.session.userId.toString() !== id) {
            // req.flash("error", "Unauthorized action");
            return res.redirect("/listing"); 
        }
        // 🏠 Find user's listings
        const listings = await Listing.find({ User: id });
        const listingIds = listings.map(l => l._id);

        // 🧹 Delete reviews (FAST WAY)
        await Review.deleteMany({
            listing: { $in: listingIds }
        });

        // 🧹 Delete listings
        await Listing.deleteMany({ User: id });
        res.redirect(`/listing/user/${id}`);

    } catch (err) {
        console.log(err);
        // req.flash("error", "Something went wrong");
        res.redirect(`/listing/user/${id}`);
    }
});


module.exports=app;