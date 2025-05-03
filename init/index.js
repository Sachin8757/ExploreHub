const mongoose=require('mongoose')
const Listing=require("../model/listing.js")
const initData=require("./data.js")
const {Schema}=mongoose.Schema;
const url="mongodb://127.0.0.1:27017/wanderlust";

//  const url="mongodb+srv://sachin875788:8757887103@wanderlust.zrj8k.mongodb.net/?retryWrites=true&w=majority&appName=wanderlust";
main().then(()=>{
    console.log("db connected !");
}).catch((err)=>{
    console.log(err)
})
async function main() {
    await mongoose.connect(url)
    
}
const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66e407a899b6150ace8531e6"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized")

}
initDB();