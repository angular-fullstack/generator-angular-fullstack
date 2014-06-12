'use strict';

mongoose = require 'mongoose'
User = mongoose.model 'User'
passport = require 'passport'

###
  Create user
###
exports.create = (req, res, next) ->
  newUser = new User req.body
  newUser.provider = 'local'
  newUser.save (err) ->
    return res.json(400, err) if err
    
    req.logIn newUser, (err) ->
      return next(err) if (err)
      res.json req.user.userInfo

###
   Get profile of specified user
###
exports.show = (req, res, next) ->
  userId = req.params.id

  User.findById userId, (err, user) ->
    return next(err) if err
    return res.send(404) unless user

    res.json profile: user.profile

###
  Change password
###
exports.changePassword = (req, res, next) ->
  userId = req.user._id
  oldPass = String req.body.oldPassword
  newPass = String req.body.newPassword

  User.findById userId, (err, user) ->
    return res.send(403) unless user.authenticate(oldPass)

    user.password = newPass
    user.save (err) ->
      return res.send(400) if err
      res.send 200

###
  Get current user
###
exports.me = (req, res) ->
  res.json req.user ? null
