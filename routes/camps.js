var express = require("express");
var router = express.Router();
var Camp = require("../models/camps.js");
var Comment = require("../models/comments.js");
var middleware = require("../middleware");


query = Camp.find({});

router.get("/",function(req,res){
  query.exec(function(err,sol){
    if(err) console.log(err);
    else {
      console.log("SENT THE DATA TO CAMPGROUNDS PAGE");
       req.flash("succes","Succesfully Logged In");
        res.render("camps/index",{camps:sol});
      }
  });

})



router.get("/new",middleware.isLoggedIn ,function(req,res){
  res.render("camps/new");
})

router.post("/",middleware.isLoggedIn ,function(req,res){
  Camp.create({
    name:req.body.name,
    iUrl:req.body.url,
    desc:req.body.des,
    author:{
      id: req.user._id,
      username:req.user.username
    },
    price:req.body.price
  },function(err,sol){
    if(err) console.log(err);
    else console.log("successfully added");
  });
  req.flash("success","Succesfully added a CampGround");
  res.redirect("/campgrounds");
});






router.get("/:id",function(req,res){
    Camp.findById(req.params.id).populate("comments").exec(function(err,sol){
      if(err) console.log(err);
      else{
        console.log(sol);
        res.render("camps/show",{camp:sol});
      }
    });
})

router.get("/:id/edit",middleware.checkCampOwnership,function(req,res){
  Camp.findOne({_id:req.params.id},function(err,sol){
    if(err) console.log(err);
    else{
      res.render("camps/edit",{camp:sol});
    }
  })
})

router.put("/:id",middleware.checkCampOwnership,function(req,res){
  console.log("hburray");
  Camp.findByIdAndUpdate(req.params.id,req.body.camps,function(err,sol){
    if(err) {
      console.log(err);
      req.flash("error","Something went wrong!!");
      res.redirect("/campgrounds");
    }
    else{
      console.log(sol);
        req.flash("success","Campground successfully updated!");
      res.redirect("/campgrounds/"+req.params.id);
    }
  })
})

router.delete("/:id/delete",middleware.checkCampOwnership,function(req,res){
  console.log("delte");
  Camp.findOne({_id:req.params.id}).populate("comments").exec(function(err,sol){
    if(err) {
      console.log(err);
      req.flash("error","Something went wrong!");
      res.redirect("back");
    }
    else{
      Comment.deleteMany(sol,function(error){
        if(error) {
          console.log(error);
          req.flash("error","Something went wrong!");
          res.redirect("back");
        }
        else{
          console.log("comments deleted");
          Camp.deleteOne(sol,function(error2){
            if(error2) {
              console.log(error2);
              req.flash("error","Something went wrong!");
              res.redirect("back");
            }

            else {
              console.log("Camp also deleted");
              req.flash("success","Campground succesfully deleted!");
              res.redirect("/campgrounds");
            }
          });
        }

      });

    }
  });
});

module.exports = router;
