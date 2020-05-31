var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users.js");



router.get("/",function(req,res){
  res.render("landingpage");
})

//AUTH ROUTES
router.get("/register",function(req,res){
  res.render("register");
})

router.post("/register",function(req,res){
  User.register(new User({username:req.body.username}),req.body.password,function(err,sol){
    if(err){
      console.log(err);
      req.flash("error",err.message);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req,res,function(){
        req.flash("success","Welcome to Yelp Camp "+req.user.username);
        res.redirect("/campgrounds");
      })
    }
  })
});

router.get("/login",function(req,res){
  res.render("login");
})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/campgrounds",
  failureRedirect:"/login"
}),function(req,res){});

router.get("/logout",function(req,res){
  req.logout();
  req.flash("success","You have been succesffuly Logged Out!");
  res.redirect("/campgrounds");
});


module.exports = router;
