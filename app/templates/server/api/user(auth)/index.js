'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);<% if (filters.oauth) { %>
router.post('/:id/password', auth.isAuthenticated(), controller.setPassword);<% } %>
router.put('/:id/email', auth.isAuthenticated(), controller.changeEmail);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

// admin roles
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/:id/confirm', auth.hasRole('admin'), controller.confirm);

module.exports = router;
