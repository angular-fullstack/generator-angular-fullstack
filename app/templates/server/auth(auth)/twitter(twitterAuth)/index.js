'use strict';

var express = require('express');
var passport = require('passport');
var token = require('../token.controller');

var router = express.Router();

router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
  }))

  .get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
  }), token.setToken);

module.exports = router;