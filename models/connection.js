const mongoose = require("mongoose");
const url=process.env.DBURL;
mongoose.connect(url)
.then(()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log(err);
});