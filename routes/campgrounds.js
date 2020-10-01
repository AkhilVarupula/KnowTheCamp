var express= require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware= require("../middleware")
//INDEX- show all campgrounds
router.get("/", function(req, res){
	//Get All campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user})
		}
	});

	//res.render("campgrounds",{campgrounds:campgrounds});
});
// CREATE - add new campgrounds to database
router.post("/", middleware.isLoggedIn, function(req,res){
	
	//get data from form and add to campgrounds array
	var name=req.body.name;
	var price= req.body.price;
	var image=req.body.image;
    var desc = req.body.description;
    var author={
        id:req.user._id,
        username: req.user.username
    }
    var newCampground={name: name, price: price, image: image, description: desc, author:author}
	//Create a new campground and save to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to campgrounds
			res.redirect("/campgrounds");
		}
	});
	
});
//NEW -show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})
//SHOW- shws more info about one campground
router.get("/:id", function(req,res){
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			//console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
});

//edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
	//is user logged in 
	//if not ,redirect 
    Campground.findById(req.params.id,function(err, foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground});
    });
});
//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCampGround){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" +req.params.id);
        }
    });
});

// Destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");	
		}else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports= router;