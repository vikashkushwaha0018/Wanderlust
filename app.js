const express = require("express");
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing");
const path = require("path")
const methodoveride = require("method-override")
const ejsmate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js")


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoveride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err)
})
async function main() {
    await mongoose.connect(MONGO_URL);
}



app.get('/', (req, res) => {
    res.send("connection successful")
})


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
        
        if (error) {
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else{
            next();
        }
}

// Index route
app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);

// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

// Show route

app.get('/listings/:id', wrapAsync(
    async (req, res) => {
        let { id } = req.params
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing })
    })
)

// create route

app.post("/listings",validateListing,
    wrapAsync(async (req, res) => {
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect('/listings');
    })
)

// Edit route

app.get("/listings/:id/edit", wrapAsync(
    async (req, res) => {
        let { id } = req.params
        const listingz = await Listing.findById(id);
        res.render("listings/edit.ejs", { listingz })
    })
)

// Update route 
app.put("/listings/:id", wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
})
)

// Delete route

app.delete("/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedlisting = await Listing.findByIdAndDelete(id);
        res.redirect("/listings");

    })
)


// app.get('/listingtest',async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location: "Calcute , goa",
//         country: " India",

//     })
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing")
// })
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080, () => {
    console.log("server is listening on port 8080")
})
