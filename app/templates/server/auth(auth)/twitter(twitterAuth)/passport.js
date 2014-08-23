'use strict';

var passport        = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

exports.setup = function (User, config) {
  passport.use(new TwitterStrategy(config.twitter,
    function(token, tokenSecret, profile, done) {

      User.findOne({ 'strategies.twitter.id_str': profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) return done(null, user);

        User.create({
          name: profile.displayName,
          username: profile.username,
          strategies: { twitter: profile._json }

        }, function(err, user) {
          if (err) return done(err);
          return done(null, user);

        });
      });
    }
  ));
};