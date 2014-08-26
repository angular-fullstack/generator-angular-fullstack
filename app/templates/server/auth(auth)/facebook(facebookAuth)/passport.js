'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function (User, config) {
  passport.use(new FacebookStrategy(config.facebook,
    function(accessToken, refreshToken, profile, done) {

      User.findOne({ 'strategies.facebook.id': profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) return done(null, user);

        User.findDuplicates({

          // We can treat this email as confirmed because:
          //  Without confirming user's are not able to "log in to apps"
          //  more: http://goo.gl/OKcd6H
          email: profile.emails[0].value

        }, function (err, users) {
          if (err) return done(err);
          if (users) {
            user = users[0];
            user.absorb(profile.provider, profile);

            // we can do that because we have it handled by Facebook
            user.confirm(profile.emails[0].value);
            return done(null, user);
          }

          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            strategies: { facebook: profile._json }
          });
          user.confirm(profile.emails[0].value);

          user.save(function(err) {
            if(err) return done(err);
            return done(null, user);
          });

        });
      });
    }
  ));
};
