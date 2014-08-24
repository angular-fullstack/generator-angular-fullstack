'use strict';

var passport = require('passport');
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function (User, config) {
  passport.use(new GoogleStrategy(config.google,
    function(accessToken, refreshToken, profile, done) {

      User.findOne({ 'strategies.google.id': profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) return done(null, user);

        User.findDuplicates({

          // We can treat this email as confirmed because:
          //  It's immpossible to create Google account without Gmail address,
          //  and that one is returned by Google API after user signed in.
          email: profile.emails[0].value

        }, function (err, users) {
          if (err) return done(err);
          if (users) {
            user = users[0];
            user.absorb(profile.provider, profile);

            // we can do that because we have it handled by Google
            user.confirm(profile.emails[0].value);
            return done(null, user);
          }

          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            strategies: { google: profile._json }
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
