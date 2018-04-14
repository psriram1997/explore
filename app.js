var express               = require("express");
var app                   = express();
var bodyParser            = require("body-parser");
var mongoose              = require("mongoose"),
    passport              =require("passport"),
    passportLocalMongoose =require("passport-local-mongoose"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    flash                 = require("express-flash");
    
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//==========requiring models=========  
var  Campground = require("./models/campground"),
     Comment    = require("./models/comment"),
     User       = require("./models/user"),
    seedDB      = require("./seed");


//========requiring routes==========
var campgroundRoutes  = require("./routes/campground"),
    indexRoutes       = require("./routes/index"),
    commentRoutes     = require("./routes/comment")

// var DATABASEURL;
// mongoose.connect(process.env.DATABASEURL);

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,    
    store: new MongoStore({ mongooseConnection: mongoose.connection }),

cookie:{maxAge: 180 * 60 * 1000}
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
   res.locals.currentUser = req.user ;
   res.locals.error       = req.flash("error");
   res.locals.sucess      = req.flash("sucess");
   next();
});

app.use("/",indexRoutes);
app.use( "/campgrounds/:id/comments",commentRoutes);
app.use( "/campgrounds",campgroundRoutes);

// seedDB();

//=========LISTENING==================================
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("yelpcamp server initiated"); 
});