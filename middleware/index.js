// all the middleware goes here:
const Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middlewareObj = {};

// const middlewareObj = {
//   checkCampgroundOwnership() {},
//   checkCommentOwnership() {}
// };

// or

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user own campground:
        if (campground.author.id.equals(req.user._id)) {
          next();
        } else {
          // otherwise, redirect:
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};
middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user own comment:
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          // otherwise, redirect:
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// or

// module.exports = {
//   checkCampgroundOwnership() {},
//   checkCommentOwnership() {}
// };

module.exports = middlewareObj;
