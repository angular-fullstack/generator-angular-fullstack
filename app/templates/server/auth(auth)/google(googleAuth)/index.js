'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();


// available scopes:
//    https://developers.google.com/+/api/oauth
var SCOPE = [ 'profile', 'email' ];


router
  .get('/', passport.authenticate('google', {
    scope: SCOPE,
    failureRedirect: '/signup',
    session: false
  }))

  .get('/callback', passport.authenticate('google', {
    failureRedirect: '/signup',
    session: false
  }), auth.setTokenCookie);

module.exports = router;