// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;


var CountriesSchema = new Schema({

  countryName: {
    type: String,
    unique: true,
    required: true
  },
  countryImage: {
    type: String,
    unique: true,
    required: true
  },
  countryDescription: {
    type: String,
    unique: true,
    required: true  
  },
  countryMap: {
    type: String,
    unique: true,
    required: true  
  },
  
});

var Country = mongoose.model("Countries", CountriesSchema);

module.exports = Country;
