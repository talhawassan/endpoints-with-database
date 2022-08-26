// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oauth2').Strategy;
// require('dotenv').config()

// passport.serializeUser((user , done) => {
//     done(null , user);
// })
// passport.deserializeUser(function(user, done) {
//     done(null, user);
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URI,
//     passReqToCallback:true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     return done(null, profile);
//   }
// ));

require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/usermodel')
 
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URI
    },
        async function  (accessToken, refreshToken, profile, done) {
               try {
                 let user =  await User.findOne({ googleId: profile.id })
                 if(user){
                  return done(null, user)
                 }else {
                    const newUser = ({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                       
                    })
                    user = await User.create(newUser)
                    return done(null, newUser)
                 }
               } catch (err) {
                   console.log(err)
               }
        }
    ));
}

passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
});