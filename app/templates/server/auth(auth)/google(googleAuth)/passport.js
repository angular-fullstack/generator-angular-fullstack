import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';

export function setup(User, config) {
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    <% if (filters.mongooseModels) { %>User.findOne({'google.id': profile.id}).exec()<% }
       if (filters.sequelizeModels) { %>User.find({where:{'google.id': profile.id}})<% } %>
      .then(user => {
        if (user) {
          return done(null, user);
        }

        <% if (filters.mongooseModels) { %>user = new User({<% }
           if (filters.sequelizeModels) { %>user = User.build({<% } %>
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          username: profile.emails[0].value.split('@')[0],
          provider: 'google',
          google: profile._json
        });
        <% if (filters.mongooseModels) { %>user.save()<% }
           if (filters.sequelizeModels) { %>user.save()<% } %>
          .then(user => done(null, user))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
