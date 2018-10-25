var     express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        seedDB      = require("./seeds");
        

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA 


// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://images.unsplash.com/photo-1496425745709-5f9297566b46?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b084690f83c5e63fafd161f8bc729a1f&auto=format&fit=crop&w=1050&q=80",
//         description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
//     }, 
    
//         function(err, campground){
//             if(err){
//                 console.log(err);
//             } else {
//             console.log("NEWLY CREATED CAMPGROUND: ");
//             console.log(campground);
//             }
//         }
    
//     );


// Root route

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX ROUTE - Show all campgrounds

app.get("/campgrounds", function(req, res){
    
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
    // res.render("campgrounds", {campgrounds: campgrounds});
});

// CREATE - add new campground

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;  
    var newCampground = {name: name, image: image, description: desc};
    // create a new campgropund and save it to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW - display form for new campground

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

//SHOW route

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
//      render show template
        res.render("show.ejs", {campground: foundCampground});
        }
    });
    
    
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp Server Has Started"); 
});