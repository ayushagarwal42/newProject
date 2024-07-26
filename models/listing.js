const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        image: {
            type: String,
            default: "https://unsplash.com/photos/a-driveway-with-trees-and-bushes-surrounding-it-LSSqJMbwS9g",
            set: (v) =>
                v === ""
                    ? "https://unsplash.com/photos/a-driveway-with-trees-and-bushes-surrounding-it-LSSqJMbwS9g"
                    : v,
        },
        price: {
            type: Number
        },
        location: {
            type: String
        },
        country: {
            type: String
        },
    }
);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;