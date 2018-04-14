var express = require("express"),
    router  = express.Router({mergeParams:true}),
    Campground=require("../models/campground"),
    Comment=require("../models/comment"),
    middlewareObj = require("../middleware");


//===========new comment route===========
router.get("/new",middlewareObj.isLoggedIn,function(req, res) {
  Campground.findById(req.params.id,function(err,foundCampground){
      if(err){
          req.flash("error",err.message);
         res.redirect("back");
      }else{
          res.render("comments/new",{campground:foundCampground});
      }
  });
});

//============create comment route=======
router.post("/",middlewareObj.isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err, foundCampground) {
      if(err){
          req.flash("error",err.message);
          res.redirect("back");
      } else{
          Comment.create(req.body.comment,function(err,comment){
              if(err){
                           
                  req.flash("error",err.message);
                  res.redirect("back");
              }else{
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  foundCampground.comments.push(comment);
                  foundCampground.save();
                  req.flash("sucess","created your comment");
                  res.redirect("/campgrounds/"+req.params.id);
              }
          });
      }
   });
});
//==============update comment=============
router.put("/:comment_id",middlewareObj.checkCommentOwner,function(req,res){
//   res.send("reached update comment");
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
       if(err){
           res.redirect("back");
       } 
       else{
           req.flash("sucess","Edited your comment");
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
});

//=============edit comment=================
router.get("/:comment_id/edit",middlewareObj.checkCommentOwner,function(req,res){
   Comment.findById(req.params.comment_id,function(err, foundComment) {
       if(err){
           
           res.redirect("back");
       }else{
        //   console.log("edit comment");
            res.render("comments/edit",{comment:foundComment,campgroundId:req.params.id}) ;
        }
   }) ;
});
//============delete comment===============
router.delete("/:comment_id",middlewareObj.checkCommentOwner,function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id,function(err,comment){
       if(err){
           res.redirect("back");
       }else{
           req.flash("sucess","sucessfully deleted");
           res.redirect("/campgrounds/"+req.params.id);
       }
   }) ;
});



module.exports = router;