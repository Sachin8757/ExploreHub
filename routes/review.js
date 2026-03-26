const express = require('express');
const router = express.Router();

const isLogin = require("../middleware/islogin.js");
const Listing = require("../models/listing.js");
// const User = require("../models/user.js"); // if needed

const Review = require("../models/review.js");

router.post("/listing/:id/review", async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const listing = await Listing.findById(req.params.id);

    const newReview = new Review({
      rating: rating,
      comment: comment,
      user: req.session.userId,
      listing: req.params.id   // ✅ FIXED
    });

    await newReview.save();

    listing.reviews.push(newReview._id);
    await listing.save();

    res.redirect(`/listing/details/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.send("Error adding review");
  }
});

// DELETE REVIEW
router.post("/listing/:id/review/:reviewId/delete", isLogin, async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    // 🔍 find review
    const review = await Review.findById(reviewId);

    // 🔐 only owner can delete
    if (review.user.toString() !== req.session.userId.toString()) {
      return res.send("Not authorized");
    }

    // 🗑️ delete review from Review collection
    await Review.findByIdAndDelete(reviewId);

    // 🧹 remove review reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    return res.redirect(`/listing/details/${id}`);
  } catch (err) {
    console.log(err);
    return res.send("Error deleting review");
  }
});

module.exports = router;