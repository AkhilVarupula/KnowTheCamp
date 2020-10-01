
var express = require("express");
var app= express();
var bodyParser =require("body-parser");
var mongoose = require("mongoose");
var flash   = require("connect-flash");
var Campground= require("./models/campground.js");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport= require("passport");
var LocalStrategy= require("passport-local");
var methodOverride = require("method-override");
var User= require("./models/user");
//requiring routes
var commentRoutes= require("./routes/comments"),
	campgroundRoutes= require("./routes/campgrounds"),
	indexRoutes=require("./routes/index");
//seed the database
//seedDB();
mongoose.connect("mongodb://localhost:27017/know_the_camp",{useUnifiedTopology: true, useNewUrlParser: true},);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"This is the secret from app.js",
	resave: false,
	saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
	res.locals.currentUser= req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server has started..!!!");
});