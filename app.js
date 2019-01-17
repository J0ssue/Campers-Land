const bodyParser = require('body-parser'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  flash = require('connect-flash'),
  passport = require('passport'),
  methodOverride = require('method-override'),
  LocalStrategy = require('passport-local'),
  mongoose = require('mongoose'),
  express = require('express'),
  seedDB = require('./seeds'),
  User = require('./models/user'),
  app = express(),
  PORT = process.env.PORT || 3000;

// REQUIRING ROUTES:
const campgroundRoutes = require('./routes/campgrounds'),
  commentRoutes = require('./routes/comments'),
  indexRoutes = require('./routes/index');

// CONNETING DATABASE:
mongoose.connect(
  'mongodb://localhost:27017/campers_land',
  { useNewUrlParser: true }
);

// APP CONFIG:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

// seedDB(); //seeds the DB

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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// USE REQUIRED ROUTES:
app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

// Route to Home Page:

app.listen(PORT, () => {
  console.log('App Running in localhost:3000');
});
