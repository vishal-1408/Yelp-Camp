var express = require("express");
var router  = express.Router({mergeParams :true});
var Camp = require("../models/camps.js");
var Comment = require("../models/comments.js");
var middleware = require("../middleware");


router.get("/new",middleware.isLoggedIn,function(req,res){
  Camp.findById(req.params.id).populate("comments").exec(function(err,sol){
    if(err) console.log(err);
    else{
         res.render("comments/new",{camp:sol});
    }
  });

});

router.post("/",middleware.isLoggedIn,function(req,res){
  Camp.findById(req.params.id,function(er,camp){
    if (er){
      console.log(er);
      req.flash("error","Something went wrong!!");
      res.redirect("back");
    }
    else{
    Comment.create(req.body.comment,function(err,sol){
      if(err){
        console.log(err);
        req.flash("error","Something went wrong!!");
        res.redirect("back");
      }
      else{
        sol.author.id = req.user._id;
        sol.author.username = req.user.username;
        sol.save();
        console.log("comment saved");
        camp.comments.push(sol);
        camp.save();
        console.log("comment added to camp");
        req.flash("success","Comment added successfully");
        res.redirect("/campgrounds/"+req.params.id);
          }
        });
      }
    });
});

router.get("/:idtwo/edit",middleware.checkCommentOwnership,function(req,res){
Comment.findById(req.params.idtwo,function(err,sol){
         if(err){
           console.log(err);
           req.flash("error","Something went wrong!");
           res.reditrect("back");
         }
         else{
           res.render("comments/edit",{comment:sol,campid:req.params.id});
         }
 });

});

router.put("/:idtwo",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.idtwo,req.body.comment,function(err,sol){
    if(err){
       console.log(err);
       req.flash("error","Something went wrong!");
       res.reditrect("back");

    }
    else{
      console.log(sol);
      req.flash("success","Comment succesfully updated!");
      res.redirect("/campgrounds/"+req.params.id);
    }
  })
})

router.delete("/:idtwo/delete",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.idtwo,function(err){
    if(err){
      console.log(err);
      req.flash("error","Something went wrong!");
      res.reditrect("back");
    }
    else {console.log("comment removed");
      req.flash("success","Comment succesfully deleted!");
    res.redirect("/campgrounds/"+req.params.id);
  }
  });

})



module.exports = router;
