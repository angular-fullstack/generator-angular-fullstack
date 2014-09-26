'use strict';

var express = require('express');
var controller = require('./<%= name %>.controller');
<% if(filters.mongoose && authenticated) { %>var auth = require('../../auth/auth.service');<% } %>
var router = express.Router();
<% if(filters.mongoose && authenticated) { %>
router.use(auth.isAuthenticated(), function(req, res, next) {
  if(req.user.role !== 'admin') {
    if(req.query.user && req.query.user !== req.user._id) { return res.send(403); }
    req.query.user = req.user._id;
  }

  next();
});<% } %>

router.get('/', controller.index);<% if(filters.mongoose) { %>
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.replace);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);<% } %>

module.exports = router;
