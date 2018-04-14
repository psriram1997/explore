var express = require("express"),
    router  = express.Router(),
    User   =require("../models/user"),
    passport=require("passport");
    
//======ROOT ROUTE ===============

router.get("/",function(req,res){
   res.render("campgrounds/landing"); 
});


//==============register==============
router.get("/register",function(req, res) {
    res.render("register");
});

router.post("/register",function(req,res){
   User.register(new User({username:req.body.username}),req.body.password,function(err,user){
       if(err){
           req.flash("error",err.message);
           res.redirect("/register");
       }else{
           passport.authenticate("local")(req,res,function(){
               req.flash("success","welcome"+user.username);
               res.redirect("/campgrounds");
            }) ;
       }
   });
});

router.get("/login",function(req, res) {
    res.render("login");
});

router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }),function(req,res){
});


router.get("/logout",function(req, res) {
   req.logout();
   req.flash("sucess","Logged you out");
   res.redirect("/campgrounds");
});

module.exports = router;
