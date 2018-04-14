var express = require("express"),
    router  = express.Router(),
    Campground=require("../models/campground"),
    middlewareObj = require("../middleware");





//======CAMPGROUND================

router.get("/",function(req,res){
    
    Campground.find({},function(err,allCampgrounds){
       if(err){
           console.log(err);
       } 
       else{
         res.render("campgrounds/index",{campgrounds:allCampgrounds}); 
          
       }
    });
});
//==========CREATE ROUTE==============

router.post("/",middlewareObj.isLoggedIn,function(req,res){
  var name = req.body.name , url =req.body.url,desc = req.body.desc;
   
   var newcampground={
      name :name,
      url : url,
      desc:desc,
      author:{
          id : req.user._id,
          username:req.user.username
      }
    };
    
    Campground.create(newcampground,function(err,newcampground){
       if(err){
           req.flash("error","Failed to create. Try again");
           res.redirect("back");
       } else{
           req.flash("sucess","created a new campground");
           res.redirect("/campgrounds");
       }
    });
});



//============NEW ROUTE=============

router.get("/new",middlewareObj.isLoggedIn,function(req, res) {
   res.render("campgrounds/new"); 
});

//============SHOW ROUTE===========
router.get("/:id",function(req,res){
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       } else{
           res.render("campgrounds/show",{campground:foundCampground});
          
       }
    });
});

//===============EDIT ROUTE==========
router.get("/:id/edit",middlewareObj.checkCampgroundOwner ,function(req, res) {
   Campground.findById(req.params.id,function(err,foundCampground){
     if(err){
         res.render("back");
     }  else{
         res.render("campgrounds/edit",{campground:foundCampground}) ;
     }
   });
   
});
//==============UPDATE ROUTE=========
router.put("/:id",middlewareObj.checkCampgroundOwner,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err){
       if(err){
           res.render("back");
       }
       else{
           req.flash("sucess","updated campground");
           res.redirect("/campgrounds/"+req.params.id);
       }
   }); 
});


//==============DELETE ROUTE=========
router.delete("/:id",middlewareObj.checkCampgroundOwner,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.render("back");
       }else{
           req.flash("sucess","sucessfully deleted");
           res.redirect("/campgrounds");
       }
   }) ;
});


module.exports = router;