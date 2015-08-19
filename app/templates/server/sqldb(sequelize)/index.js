/**
 * Sequelize initialization module
 */

'use strict';

var path = require('path');
var config = require('../config/environment');

var Sequelize = require('sequelize');

var db = {
  Sequelize: Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below<% if (filters.sequelizeModels && filters.auth) { %>
db.User = db.sequelize.import('../api/user/user.model');<% } %>

module.exports = db;
