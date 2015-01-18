'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);<% if(filters.mongoose) { %>
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);<% } %>

exports.router = router;
exports.path = 'things';<% if(filters.socketio) { %>
exports.socket = require('./thing.socket.js');<% } %>
