import passport from 'passport';
import {Strategy as TwitterStrategy} from 'passport-twitter';

export function setup(User, config) {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    <% if (filters.mongooseModels) { %>User.findOneAsync({<% }
       if (filters.sequelizeModels) { %>User.find({<% } %>
      'twitter.id_str': profile.id
    })
      .then(user => {
        if(user) {
          return done(null, user);
        }

        <% if (filters.mongooseModels) { %>user = new User({<% }
           if (filters.sequelizeModels) { %>user = User.build({<% } %>
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: 'twitter',
          twitter: profile._json
        });
        <% if (filters.mongooseModels) { %>user.saveAsync()<% }
           if (filters.sequelizeModels) { %>user.save()<% } %>
          .then(user => done(null, user))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
