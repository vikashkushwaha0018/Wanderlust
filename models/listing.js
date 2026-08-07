const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
    type :String,
    required : true,
    },
    description :{
        type : String,
        required : true
    },
    
    image: {
    filename: {
        type: String,
        default: "listingimage",
    },
    url: {
        type: String,
        default:
            "https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=749&auto=format&fit=crop",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=749&auto=format&fit=crop"
                : v,
    },
},
    price :{
        type : Number,
        required : true
    },
    
    
    location :{
        type : String,
        required : true
    },
    country :{
        type : String,
        required: true
    },

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
    }]

    
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;