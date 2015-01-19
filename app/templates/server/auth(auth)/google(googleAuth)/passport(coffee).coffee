passport = require 'passport'
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

exports.setup = (User, config) ->
  passport.use new GoogleStrategy(
    clientID: config.google.clientID
    clientSecret: config.google.clientSecret
    callbackURL: config.google.callbackURL
  , (accessToken, refreshToken, profile, done) ->
    User.findOne
      'google.id': profile.id
    , (err, user) ->
      if not user
        user = new User(
          name: profile.displayName
          email: profile.emails[0].value
          role: 'user'
          username: profile.username
          provider: 'google'
          google: profile._json
        )
        user.save (err) ->
          done err  if err
          done err, user
      else
        done err, user
  )
