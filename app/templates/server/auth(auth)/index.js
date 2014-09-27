'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');

// Passport Configuration
require('./local/passport').setup(User, config);<% if (filters.facebookAuth) { %>
require('./facebook/passport').setup(User, config);<% } %><% if (filters.googleAuth) { %>
require('./google/passport').setup(User, config);<% } %><% if (filters.twitterAuth) { %>
require('./twitter/passport').setup(User, config);<% } %>

var router = express.Router();

router.use('/local', require('./local'));<% if (filters.facebookAuth) { %>
router.use('/facebook', require('./facebook'));<% } %><% if (filters.twitterAuth) { %>
router.use('/twitter', require('./twitter'));<% } %><% if (filters.googleAuth) { %>
router.use('/google', require('./google'));<% } %>

module.exports = router;
