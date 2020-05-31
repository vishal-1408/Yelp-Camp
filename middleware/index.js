var Comment = require("../models/comments.js");
var Camp = require("../models/camps.js");
var middleware = require("../middleware");

var middleobj = {};
middleobj.checkCommentOwnership = function (req,res,next){
  console.log("function triggered");
  if(req.isAuthenticated())
  {
  Comment.findById(req.params.idtwo,function(err,sol){
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    }
    else{
      console.log(req.user._id);
      console.log(sol.author.id);
      if(sol.author.id.equals(req.user._id)) next();
      else {
        req.flash("error","You don't have the permission to do that!");
        res.redirect("back");

      }
    }
  });
}
else {
  req.flash("error","You need to be Logged In do that!");
  res.redirect("back");
}
};
middleobj.isLoggedIn=function(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
};

middleobj.checkCampOwnership =function(req,res,next){
  console.log("function triggered");
  if(req.isAuthenticated())
  {
  Camp.findById(req.params.id,function(err,sol){
    if(err) {
      console.log(err);

      res.redirect("/campgrounds");
    }
    else{
      console.log(req.user._id);
      console.log(sol.author.id);
      if(sol.author.id.equals(req.user._id)) next();
      else {
        req.flash("error","You don't have the permission to do that!")
        res.redirect("back");

      }
    }
  });
}
else {
  req.flash("error","You need to be Logged In to do that!");
  res.redirect("back");
}




};

module.exports = middleobj;
