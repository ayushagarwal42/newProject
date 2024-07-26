const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing");

const Db_Name = "wanderlust";
const MONGODB_URL = `mongodb://127.0.0.1:27017/${Db_Name}`;

main()
    .then(() => {
        console.log(`connected to ${Db_Name}`);
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(MONGODB_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

}
initDB();