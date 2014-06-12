'use strict'

mongoose = require 'mongoose'
passport = require 'passport'

###
  Logout
###
exports.logout = (req, res) ->
  req.logout()
  res.send 200

###
  Login
###
exports.login = (req, res, next) ->
  passport.authenticate('local', (err, user, info) ->
    error = err ? info
    return res.json(401, error) if error

    req.logIn user, (err) ->
      return res.send(err) if (err)
      res.json req.user.userInfo
  )(req, res, next)
