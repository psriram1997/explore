var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

 var campgrounds = [
       
      {
          name : "bhrigulake",
          url :"https://i2.wp.com/eizyholidays.com/wp-content/uploads/2018/02/bhrigu-lake-trek-min-1200x675.jpg?resize=1040%2C450"
      },
      {
          name : "saurkundi",
          url :"https://s3-ap-southeast-1.amazonaws.com/carabiner/treks/Saurkundi-Lake.jpg"
      },
      {
          name : "hamptapass",
          url :"http://discoverhimalaya.in/wp-content/photos/trekking/hampta%20pass%20trek%205%20-%20714.jpg"
      }
       
      ];
       

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
            campgrounds.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
     
    //add a few comments
}
 
module.exports = seedDB;
