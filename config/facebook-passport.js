const passport = require('passport')
const Strategy = require('passport-facebook').Strategy;
const User = require('../models/usermodel')
require('dotenv').config()

passport.use(new Strategy({ 
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:5002/facebook/callback',
    profileFields: ['id', 'displayName','email'] // You have the option to specify the profile objects you want returned
  },
  function(accessToken, refreshToken, profile, done) {
    //Check the DB to find a User with the profile.id
    User.findOne({ facebook_id: profile.id }, function(err, user) {//See if a User already exists with the Facebook ID
      if(err) {
        console.log(err);  // handle errors!
      }
      
      if (user) {
        done(null, user); //If User already exists login as stated on line 10 return User
      } else { //else create a new User
        user = new User({
          facebook_id: profile.id, //pass in the id and displayName params from Facebook
          name: profile.displayName,
          email: profile.emails[0].value
        });
        user.save(function(err) { //Save User if there are no errors else redirect to login route
          if(err) {
            console.log(err);  // handle errors!
          } else {
            console.log("saving user ...");
            done(null, user);
          }
        });
      }
    });
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
   cb(null, obj);
});