'use strict';

var express = require('express');
var controller = require('./<%= name %>.controller');

var router = express.Router();

router.get('/', controller.index);<% if(filters.mongoose) { %>
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.replace);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);<% } %>

exports.router = router;
exports.name = '<%= name %>';<% if(filters.socketio) { %>
exports.socket = require('./<%= name %>.socket');<% } %>
