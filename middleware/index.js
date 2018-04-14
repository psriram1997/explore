var Comment   = require("../models/comment"),
    Campground= require("../models/campground");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
  if(req.isAuthenticated()){
      return next();
    }
        req.flash("error","You must be logged in");
        res.redirect("/login");
 };

 middlewareObj.checkCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundComment) {
           if(err){
               req.flash("error","something went wrong. please try again");
               res.redirect("back");
           } else{
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error","You have no permission to do that.");
                   res.redirect("back");
               }
           }
        });
    }else{
        req.flash("error","You must be logged in");
        res.redirect("back");
    }
};



 middlewareObj.checkCampgroundOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err, foundCampground) {
           if(err){
               req.flash("error","something went wrong. please try again");
               res.redirect("back");
           } else{
               if(foundCampground.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error","You have no permission to do that.");
                   res.redirect("back");
               }
           }
        });
    }else{
        req.flash("error","You must be logged in");
        res.redirect("back");
    }
};


module.exports = middlewareObj ;