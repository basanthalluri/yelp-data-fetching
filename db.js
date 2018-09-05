var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/YOUR DB NAME");
exports.mongoose = mongoose;

var Schema = mongoose.Schema;

// Details of Restaurant Schema
var detailsSchema = new Schema({
    businessName: String,
    venu:String,
    category: [
        {title:String,alias:String}
    ],
    location: {
        address1: String,
        address2: String,
        address3: String,
        city: String,
        zip_code: String,
        country: String,
        state: String,    
    },
    url: String,
    rating: String,
    coordinates: {
        latitude:  {type: Number},
        longitude: {type: Number},
      },
      display_address:[String],
    
    phone: String,
    display_phone: String  
});

exports.Details = mongoose.model("Details", detailsSchema, "Details");

// Data for Venu Schema
var dataSchema = new Schema({
    venu:String,
    location:String  
});

exports.Data = mongoose.model("Data", dataSchema, "Data");