import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

exports.setup = function(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: [
      'displayName',
      'emails'
    ]
  },
  function(accessToken, refreshToken, profile, done) {
    <% if (filters.mongooseModels) { %>User.findOneAsync({<% }
       if (filters.sequelizeModels) { %>User.find({<% } %>
      'facebook.id': profile.id
    })
      .then(function(user) {
        if (!user) {
          <% if (filters.mongooseModels) { %>user = new User({<% }
             if (filters.sequelizeModels) { %>user = User.build({<% } %>
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            provider: 'facebook',
            facebook: profile._json
          });
          <% if (filters.mongooseModels) { %>user.saveAsync()<% }
             if (filters.sequelizeModels) { %>user.save()<% } %>
            .then(function(user) {
              return done(null, user);
            })
            .catch(function(err) {
              return done(err);
            });
        } else {
          return done(null, user);
        }
      })
      .catch(function(err) {
        return done(err);
      });
  }));
};
