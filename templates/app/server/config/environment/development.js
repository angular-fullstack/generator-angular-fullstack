'use strict';

// Development specific configuration
// ==================================
module.exports = {<% if (filters.mongoose) { %>

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/<%= lodash.slugify(appname) %>-dev'
  },<% } if (filters.sequelize) { %>

  // Sequelize connection opions
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'dev.sqlite',
      define: {
        timestamps: false
      }
    }
  },<% } %>

  // Seed database on startup
  seedDB: true

};
