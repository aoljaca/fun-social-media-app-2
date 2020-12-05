const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = 
    function(passport) {
        passport.use(new LocalStrategy(
            async (username, password, done) => {
              await User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                  return done(null, false, { message: 'Incorrect username.' });
                }
                
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                      return done(null, user);
                    } else {
                      return done(null, false, { message: 'Password incorrect' });
                    }
                  });
              }
              );
            }
          ));
        passport.serializeUser(function(user, done) {
            done(null, user.id);
          });
        
        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
              done(err, user);
            });
        });
    }
