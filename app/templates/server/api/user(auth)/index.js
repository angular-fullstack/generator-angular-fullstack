'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config');
var access = require('../../components/access/access');

var router = express.Router();

router.get('/', access.hasRole('admin'), controller.index);
router.delete('/:id', access.hasRole('admin'), controller.destroy);
router.get('/me', access.isAuthenticated, controller.me);
router.put('/:id/password', access.isAuthenticated, controller.changePassword);
router.get('/:id', access.isAuthenticated, controller.show);
router.post('/', controller.create);

module.exports = router;
