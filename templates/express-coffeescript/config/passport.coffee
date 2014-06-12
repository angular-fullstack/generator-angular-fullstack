'use strict'

mongoose = require 'mongoose'
User = mongoose.model 'User'
passport = require 'passport'
LocalStrategy = require('passport-local').Strategy

###
  Passport configuration
###
passport.serializeUser (user, done) ->
  done null, user.id
passport.deserializeUser (id, done) ->
  User.findOne
    _id: id
  , '-salt -hashedPassword', (err, user) -> # don't ever give out the password or salt
    done err, user

# add other strategies for more authentication flexibility
passport.use new LocalStrategy
    usernameField: 'email'
    passwordField: 'password' # this is the virtual field on the model
  , (email, password, done) ->
    User.findOne
      email: email.toLowerCase()
    , (err, user) ->
      return done(err) if err
      
      unless user
        return done null, false, message: 'This email is not registered.'

      unless user.authenticate password
        return done null, false, message: 'This password is not correct.'

      done null, user

module.exports = passport
