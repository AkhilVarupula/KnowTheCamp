//all the middleware goes here
var Campground =require("../models/campground");
var Comment= require("../models/comment");
var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				reqflash("error","Campground not found");
				res.redirect("back");
			} else{
				//does user own the campground
				if(foundCampground.author.id.equals(req.user.id)){
					next();
				}
				else{
					req.flash("error","You are not authorised");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error","Please Login..")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership=function (req,res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else{
				//does user own the campground
				if(foundComment.author.id.equals(req.user.id)){
					next();
				}
				else{
					req.flash("error","not authorised");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error","Please login..");
		res.redirect("back");
	}
}
middlewareObj.isLoggedIn=function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login...!!!")
	res.redirect("/login");
}
module.exports=middlewareObj;