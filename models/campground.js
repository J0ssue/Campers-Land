const mongoose = require('mongoose');

// CAMPGROUND SCHEMA CONFIG:
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
module.exports = mongoose.model('Campground', campgroundSchema);
