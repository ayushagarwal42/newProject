const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');


const port = 8080;
const Listing = require("./models/listing");

const Db_Name = "wanderlust";
const MONGODB_URL = `mongodb://127.0.0.1:27017/${Db_Name}`;

// normal function
// async function main() {
//     try {
//         await mongoose.connect(MONGODB_URL);
//         console.log(`Connected to ${Db_Name}`);
//     } catch (err) {
//         console.error(err);
//     }
// }

//arrow function
const main = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log(`Connected to ${Db_Name}`);
    } catch (err) {
        console.error(err);
    }
};

main();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(methodOverride('_method'));

//main root
app.get("/", (req, res) => {
    res.send("hi i am root");
})

//showing all listings route
app.get("/listings", async (req, res) => {
    try {
        const listings = await Listing.find({});
        res.render("listings/index.ejs", { listings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("An error occurred while fetching listings");
    }
});

//creating new listing with new.ejs
app.get("/listings/new", async (req, res) => {
    res.render("listings/new.ejs", { isEditing: false })
})

//after creating listing save in db and show it on all listings page
app.post("/listings", async (req, res) => {
    try {
        const { title, description, image, price, location, country } = req.body;
        const newListing = new Listing({ title, description, image, price, location, country });
        await newListing.save();
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).send("An error occurred while creating the listing");
    }
})

//get details of particular listing by show.ejs
app.get("/listings/:id", async (req, res) => {
    try {
        const listingId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            console.log("Listing ID:", listingId);
            return res.status(400).send("Invalid listing ID");
        }
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.status(200).render("listings/show.ejs", { listing })
    } catch (error) {
        console.log("error fetching listing details", error);
        res.status(500).send("an error occured while fetching listing details")
    }
});

//edit the particular listing with new.ejs only
app.get("/listings/:id/edit", async (req, res) => {
    try {
        const listingId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            console.log("Listing ID:", listingId);
            return res.status(400).send("Invalid listing ID");
        }
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "listing not found" })
        }
        res.status(200).render("listings/new.ejs", { listing, isEditing: true })
    } catch (error) {
        console.error("Error fetching listing for edit:", error);
        res.status(500).send("An error occurred while fetching listing for edit");
    }
})

//after editing if we made some changes then we have to update that in all listing page and in details page
app.put("/listings/:id", async (req, res) => {
    const listingID = req.params.id;
    const { title, description, image, price, location, country } = req.body;
    if (!mongoose.Types.ObjectId.isValid(listingID)) {
        console.log("Listing ID:", listingID);
        return res.status(400).send("Invalid listing ID");
    }
    try {
        const listing = await Listing.findByIdAndUpdate(listingID, { title, description, image, price, location, country }, { new: true })
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.status(200).render("listings/show.ejs", { listing })
    } catch (error) {
        console.log("Error updating listing", error);
        res.status(500).send("An error occurred while updating the listing");
    }

})

app.delete("/listings/:id", async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findByIdAndDelete(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.redirect("/listings");
    } catch (error) {
        console.log("error deleting listing", error);
        res.status(500).send("An error occurred while deleting the listing");
    }

})

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"india"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.listen(port, () => {
    console.log(`Server Is Running On Port http://localhost:${port}/`)
})