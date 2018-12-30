const mongoose = require('mongoose');

// CAMPGROUND SCHEMA CONFIG:
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongooose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});
module.exports = mongoose.model('Campground', campgroundSchema);
