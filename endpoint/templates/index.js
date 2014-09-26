'use strict';

var express = require('express');
var controller = require('./<%= name %>.controller');
<% if(filters.mongoose && authenticated) { %>var auth = require('../../auth/auth.service');<% } %>
var router = express.Router();

router.get('/', <% if(filters.mongoose && authenticated) { %>auth.hasRole('admin'), <% } %>controller.index);<% if(filters.mongoose) { %>
router.get('/:id',<% if(filters.mongoose && authenticated) { %>auth.isAuthenticated(), <% } %> controller.show);
router.post('/', <% if(filters.mongoose && authenticated) { %>auth.isAuthenticated(), <% } %>controller.create);
router.put('/:id', <% if(filters.mongoose && authenticated) { %>auth.isAuthenticated(), <% } %>controller.update);
router.patch('/:id', <% if(filters.mongoose && authenticated) { %>auth.isAuthenticated(), <% } %>controller.update);
router.delete('/:id', <% if(filters.mongoose && authenticated) { %>auth.hasRole('admin'), <% } %>controller.destroy);<% } %>

module.exports = router;
