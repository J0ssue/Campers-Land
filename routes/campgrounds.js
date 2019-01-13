const express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground'),
  middleware = require('../middleware');

// INDEX: Ahow all Campgrounds.
router.get('/', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
  // res.render('campgrounds', { campgrounds });
});

// CREATE: Add new campground to DB.
router.post('/', middleware.isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds array
  let name = req.body.name,
    image = req.body.image,
    description = req.body.description,
    author = {
      id: req.user._id,
      username: req.user.username
    };
  const newCampground = { name, image, description, author };
  // Create a new campground and save to DB:
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect to campgrounds page:
      res.redirect('/campgrounds');
    }
  });
});

// NEW: show form to create new campground.
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW: shows info about one campground;
router.get('/:id', (req, res) => {
  // find the campground with provided ID:
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// EDIT:
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('campgrounds/edit', { campground });
  });
});

// UPDATE:
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  // find and update correct campground:
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, campground) => {
      if (err) {
        res.redirect('/campgrounds');
      } else {
        // redirect somewhere(show page):
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

// DESTROY:
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
