import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';

export function setup(User, config) {
  passport.use(new GitHubStrategy({
    clientID: config.gitHub.clientID,
    clientSecret: config.gitHub.clientSecret,
    callbackURL: config.gitHub.callbackURL,
    passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, done) {
    <%_ if(filters.mongooseModels) { -%>
    User.findOne({'github.id': profile.id}).exec()<% } %>
    <%_ if(filters.sequelizeModels) { -%>
    User.find({where:{'github.id': profile.id}})<% } %>
      .then(user => {
        if(user) {
          return done(null, user);
        }

        <%_ if(filters.mongooseModels) { -%>
        user = new User({<% } %>
        <%_ if(filters.sequelizeModels) { -%>
        user = User.build({<% } %>
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          provider: 'github',
          github: profile._json
        });

        return user.save()
          .then(savedUser => done(null, savedUser))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
