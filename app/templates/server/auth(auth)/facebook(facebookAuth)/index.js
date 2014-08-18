'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

// available scopes:
//    https://developers.facebook.com/docs/facebook-login/permissions/v2.0#reference
var SCOPE = ['email', 'user_about_me'];

router
  .get('/', passport.authenticate('facebook', {
    scope: SCOPE,
    failureRedirect: '/signup',
    session: false
  }))

  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup',
    session: false
  }), auth.setTokenCookie);

module.exports = router;