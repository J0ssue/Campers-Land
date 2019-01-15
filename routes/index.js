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
      return res.render('register', { error: err.message });
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Welcome to Campers Land ' + user.username);
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
  req.flash('success', 'Logged you out!');
  res.redirect('/');
});

module.exports = router;
