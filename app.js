const bodyParser = require('body-parser'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  mongoose = require('mongoose'),
  express = require('express'),
  seedDB = require('./seeds'),
  app = express(),
  PORT = 3000;

// mongoose.connect creates the new collection inside data dir:
mongoose.connect(
  'mongodb://localhost:27017/campers_land',
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
seedDB(); //seeds the DB

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
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
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
  res.render('campgrounds/new');
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
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// ==========================
// COMMENTS ROUTES
// ==========================
app.get('/campgrounds/:id/comments/new', (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

app.post('/campgrounds/:id/comments', (req, res) => {
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
          // connect new commnet to campground
          campground.comments.push(comment);
          campground.save();
          // redirect to campground show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log('App Running in localhost:3000');
});
