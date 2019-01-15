const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middleware');

// NEW:
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
  // lookup campground using id:
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash('Something went wrong');
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
          // redirect to campground show page
          req.flash('success', 'Successfuly added comment');
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// EDIT:
router.get(
  '/:comment_id/edit',
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', { campground_id: req.params.id, comment });
      }
    });
  }
);

// UPDATE:
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
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
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment Deleted');
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;

// APP BUILDING PROCESS:
// 1 - have an idea
// 2 - check design pattern websites for ideas
// 3 - write down how to implement ideas on a site
// 4 - draw a layout according to your implementation ideas
// 5 - code your site, reiterate to step 3 if something does not match expectations.
