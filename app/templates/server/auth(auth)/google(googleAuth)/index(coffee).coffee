'use strict'

express = require 'express'
passport = require 'passport'
auth = require '../auth.service'

router = express.Router()

router.get('/', passport.authenticate('google',
  failureRedirect: '/signup'
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile'
    'https://www.googleapis.com/auth/userinfo.email'
  ]
  session: false
)).get '/callback', passport.authenticate('google',
  failureRedirect: '/signup'
  session: false
), auth.setTokenCookie

module.exports = router
