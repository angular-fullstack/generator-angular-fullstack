passport = require 'passport'
FacebookStrategy = require('passport-facebook').Strategy

exports.setup = (User, config) ->
  passport.use new FacebookStrategy(
    clientID: config.facebook.clientID
    clientSecret: config.facebook.clientSecret
    callbackURL: config.facebook.callbackURL
  , (accessToken, refreshToken, profile, done) ->
    User.findOne
      'facebook.id': profile.id
    , (err, user) ->
      return done(err)  if err
      if not user
        user = new User(
          name: profile.displayName
          email: profile.emails[0].value
          role: 'user'
          username: profile.username
          provider: 'facebook'
          facebook: profile._json
        )
        user.save (err) ->
          done err  if err
          done err, user
      else
        done err, user
  )
