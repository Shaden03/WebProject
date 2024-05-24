const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Local strategy for signup
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return done(null, false, { message: 'Email already used' });
        } else {
            const newUser = new User({
                email: email,
                password: password // This will be hashed by the pre-save hook
            });
            await newUser.save();
            return done(null, newUser, { message: 'User Added' });
        }
    } catch (error) {
        return done(error);
    }
}));
// Local strategy for login
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'User was not found' });
        }
        const isMatch = await user.comparePasswords(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user, { message: 'Welcome back' });
    } catch (error) {
        return done(error);
    }
}));