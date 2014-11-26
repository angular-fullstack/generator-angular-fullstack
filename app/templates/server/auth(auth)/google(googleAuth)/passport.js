var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function(User, config) {
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    <% if (filters.mongooseModels) { %>User.findOneAsync({<% }
       if (filters.sequelizeModels) { %>User.find({<% } %>
      'google.id': profile.id
    })
      .then(function(user) {
        if (!user) {
          <% if (filters.mongooseModels) { %>user = new User({<% }
             if (filters.sequelizeModels) { %>user = User.build({<% } %>
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'google',
            google: profile._json
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
