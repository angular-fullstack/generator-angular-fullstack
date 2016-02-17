import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

function localAuthenticate(User, email, password, done) {
  <% if (filters.mongooseModels) { %>User.findOneAsync({
    email: email.toLowerCase()
  }, '+salt +hashedPassword')<% }
     if (filters.sequelizeModels) { %>User.unscoped().find({
    where: {
      email: email.toLowerCase()
    }
  })<% } %>
    .then(user => {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      user.authenticate(password, function(authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, { message: 'This password is not correct.' });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(err => done(err));
}

export function setup(User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function(email, password, done) {<% if (filters.models) { %>
    return localAuthenticate(User, email, password, done);
<% } %>  }));
}
