'use strict';

var express = require('express');
var controller = require('./<%= name %>.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('<%= name %>s-index'), controller.index);
router.get('/:id', auth.hasRole('<%= name %>s-show'), controller.show);
router.post('/', auth.hasRole('<%= name %>s-create'), controller.create);
router.put('/:id', auth.hasRole('<%= name %>s-update'), controller.update);
router.patch('/:id', auth.hasRole('<%= name %>s-update'), controller.update);
router.delete('/:id', auth.hasRole('<%= name %>s-destroy'), controller.destroy);

module.exports = router;
