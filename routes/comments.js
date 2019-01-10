const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// NEW:
router.get('/new', isLoggedIn, (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// CREATE:
router.post('/', isLoggedIn, (req, res) => {
  // lookup campground using id:
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // add username and id to comment:
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment:
          comment.save();
          // connect new commnet to campground
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          // redirect to campground show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// EDIT:
router.get('/:comment_id/edit', (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', { campground_id: req.params.id, comment });
    }
  });
});

// UPDATE:
router.put('/:comment_id', (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, comment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

// DESTROY:
router.delete('/:comment_id', (req, res) => {
  console.log(req.params);
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// AUTHENTICATION MIDDLEWARE:
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
