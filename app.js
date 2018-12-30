const bodyParser = require('body-parser'),
  Campground = require('./models/campground'),
  mongoose = require('mongoose'),
  express = require('express'),
  seedDB = require('./seeds'),
  app = express(),
  PORT = 3000;

// seeds the database
seedDB();
// mongoose.connect creates the new collection inside data dir:
mongoose.connect(
  'mongodb://localhost:27017/campers_land',
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Route to Home Page:
app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX: Ahow all Campgrounds.
app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campgrounds: allCampgrounds });
    }
  });
  // res.render('campgrounds', { campgrounds });
});

// CREATE: Add new campground to DB.
app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
});

// SHOW: shows info about one campground;
app.get('/campgrounds/:id', (req, res) => {
  // find the campground with provided ID:
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        res.render('show', { campground: foundCampground });
      }
    });
});

app.listen(PORT, () => {
  console.log('App Running in localhost:3000');
});
