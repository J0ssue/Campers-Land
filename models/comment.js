const mongoose = require('mongoose');

// CREATES COMMENT SCHEMA:
const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

module.exports = mongoose.model('Comment', commentSchema);
