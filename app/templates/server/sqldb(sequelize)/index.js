/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize: Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below<% if (filters.sequelizeModels && filters.auth) { %>
db.User = db.sequelize.import('../api/user/user.model');<% } %>

module.exports = db;
