const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// ROOT ROUTE:
router.get('/', (req, res) => {
  res.render('landing');
});

// REGISTER FORM ROUTES:
router.get('/register', (req, res) => {
  res.render('register');
});

// handle register logic:
router.post('/register', (req, res) => {
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

// LOGIN FORM ROUTES:
router.get('/login', (req, res) => {
  res.render('login');
});

// handling login logic:
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

// LOGOUT LOGIC:
router.get('/logout', (req, res) => {
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

module.exports = router;
