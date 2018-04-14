var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
var campgroundSchema = mongoose.Schema({
    name : String,
    url  :String,
    desc  :String,
    comments : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    author :{
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref  : "User"
        },
        username:String
    }
});


var Campground = mongoose.model("Campground",campgroundSchema);

module.exports = Campground;