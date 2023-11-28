const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const dotenv = require("dotenv").config();
const User = require("../models/user-model");

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user.id);
  });
});

passport.deserializeUser(function (id, cb) {
  process.nextTick(function () {
    User.findById(id).then((user) => {
      cb(null, user);
    });
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for the google strategy
      callbackURL: "/auth/google/redirect",
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
    },
    (accessToken, refreshToken, profile, cb) => {
      // check if user already exist if dont create new User
      console.log(profile);

      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          cb(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              cb(null, newUser);
            });
        }
      });
    }
  )
);
