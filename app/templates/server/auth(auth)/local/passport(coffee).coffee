passport = require 'passport'
LocalStrategy = require('passport-local').Strategy

exports.setup = (User, config) ->
  passport.use new LocalStrategy(
    usernameField: 'email'
    passwordField: 'password' # this is the virtual field on the model
  , (email, password, done) ->
    User.findOne
      email: email.toLowerCase()
    , (err, user) ->
      return done(err)  if err
      if not user
        return done(null, false,
          message: 'This email is not registered.'
        )
      unless user.authenticate(password)
        return done(null, false,
          message: 'This password is not correct.'
        )
      done null, user
  )
