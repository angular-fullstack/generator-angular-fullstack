'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config');
var User = require('../api/user/user.model');

// Passport Configuration
require('./local/passport').setup(User, config);<% if (facebookAuth) { %>
require('./facebook/passport').setup(User, config);<% } %><% if (googleAuth) { %>
require('./google/passport').setup(User, config);<% } %><% if (twitterAuth) { %>
require('./twitter/passport').setup(User, config);<% } %>

var router = express.Router();

router.use('/local', require('./local'));<% if (facebookAuth) { %>
router.use('/facebook', require('./facebook'));<% } %><% if (googleAuth) { %>
router.use('/twitter', require('./twitter'));<% } %><% if (twitterAuth) { %>
router.use('/google', require('./google'));<% } %>

module.exports = router;