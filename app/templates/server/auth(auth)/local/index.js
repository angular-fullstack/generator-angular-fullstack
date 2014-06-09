'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.controller');

var router = express.Router();

router.post('/', auth.authenticate);

module.exports = router;