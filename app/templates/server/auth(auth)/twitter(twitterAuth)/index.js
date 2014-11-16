'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
  }))

  .get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
  }), auth.setTokenCookie);

module.exports = router;