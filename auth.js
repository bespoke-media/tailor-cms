const router = require("express").Router();
const passport = require("passport");

require("dotenv").config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.HOST_NAME + '/auth/google/callback',
      scope: ['profile', 'email'],
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { email: user.emails[0].value, name: user.displayName, picture: user.photos[0].value });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get(
  '/google/login',
  passport.authenticate('google')
);

router.get(
  '/google/failure',
  function (req, res) {
    res.render('login-failure', { loginHref: '/', });
  }
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
  function (req, res) {
    const email = req.user.emails[0].value;
    const name = req.user.displayName;
    const picture = req.user.photos[0].value
    res.render('login-success', { user: { email, name, picture }, logoutHref: '/auth/google/logout', continueHref: '/', });
  }
);

router.get(
  '/google/logout',
  function (req, res) {
    req.logout(function () {
      res.redirect('/');
    });
  }
);

module.exports = router;
