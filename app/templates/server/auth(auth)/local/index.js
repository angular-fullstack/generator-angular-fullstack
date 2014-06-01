'use strict';

var express = require('express');
var passport = require('passport');
var token = require('../token.controller');

var router = express.Router();

router.post('/', token.authenticate);

module.exports = router;