import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

export function setup(User, config) {
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
    <% if(filters.mongooseModels) { %>User.findOne({'facebook.id': profile.id}).exec()<% }
       if(filters.sequelizeModels) { %>User.find({where:{'facebook.id': profile.id}})<% } %>
      .then(user => {
        if(user) {
          return done(null, user);
        }

        <% if(filters.mongooseModels) { %>user = new User({<% }
           if(filters.sequelizeModels) { %>user = User.build({<% } %>
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          provider: 'facebook',
          facebook: profile._json
        });
        user.save()
          .then(savedUser => done(null, savedUser))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
