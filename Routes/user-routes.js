const express = require('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');

// Middleware to check if the user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/users/login');
};
// Login User View
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Login POST Request
router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/index.html',
    failureRedirect: '/users/login',
    failureFlash: true
}));

// Sign Up View
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

// Sign Up POST Request
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/index.html',
    failureRedirect: '/users/signup',
    failureFlash: true
}));

// Logout User
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/users/login');
    });
});

module.exports = router;
