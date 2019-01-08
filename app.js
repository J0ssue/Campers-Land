const bodyParser = require('body-parser'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  mongoose = require('mongoose'),
  express = require('express'),
  seedDB = require('./seeds'),
  User = require('./models/user'),
  app = express(),
  commentRoutes = require('./routes/comments'),
  PORT = 3000;

// mongoose.connect creates the new collection inside data dir:
mongoose.connect(
  'mongodb://localhost:27017/campers_land',
  { useNewUrlParser: true }
);

// APP CONFIG:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
seedDB(); //seeds the DB

// PASSPORT(AUTH) CONFIG:
app.use(
  require('express-session')({
    secret: 'hello world',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passing user as middleware to be able to display Currently logged in User's info!:
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Route to Home Page:
app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX: Ahow all Campgrounds.
app.get('/campgrounds', (req, res) => {
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
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

// ===============
// AUTH ROUTES:
// ==============

// REGISTER ROUTES:
app.get('/register', (req, res) => {
  res.render('register');
});

// handle register logic:
app.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// LOGIN ROUTES:
app.get('/login', (req, res) => {
  res.render('login');
});

// handling login logic:
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

// LOGOUT LOGIC:
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// MIDDLEWARE:
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(PORT, () => {
  console.log('App Running in localhost:3000');
});
