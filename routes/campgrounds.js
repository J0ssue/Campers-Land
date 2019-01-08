const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

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
router.post('/', (req, res) => {
  // get data from form and add to campgrounds array
  let name = req.body.name,
    image = req.body.image,
    description = req.body.description;
  const newCampground = { name, image, description };
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
router.get('/new', (req, res) => {
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
        console.log(foundCampground);
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

module.exports = router;
