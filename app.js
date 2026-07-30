const express = require("express");
const app = express()
const mongoose = require("mongoose")
const listing = require("./models/listing");
const Listing = require("./models/listing");
const path = require("path")
const methodoveride = require("method-override")
const ejsmate = require("ejs-mate")


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoveride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err)
})
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get('/',(req,res)=>{
    res.send("connection successful")
})

// Index route
app.get('/listings',async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

// new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

// Show route

app.get('/listings/:id',async (req,res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
})

// create route

app.post("/listings",async (req,res)=>{
    let newlisting = new listing(req.body.listing);
    newlisting.save();
    res.redirect('/listings');
})

// Edit route

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})

// Update route 
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
   await  Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
    })

// Delete route

app.delete("/listings/:id" , async (req,res)=>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

}
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

app.listen(8080,()=>{
    console.log("server is listening on port 8080")
})