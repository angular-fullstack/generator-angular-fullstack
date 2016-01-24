'use strict';

// Development specific configuration
// ==================================
module.exports = {<% if (filters.mongoose) { %>

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/<%= lodash.slugify(appname) %>-dev'
  },<% } if (filters.sequelize) { %>

  // Sequelize connection options
  sequelize: {
    uri: 'sqlite://',
// Postgres: (also uncomment storage: 'dev.sqlite' line below)
//  uri: 'postgres://' + process.env.USER + ':@SERVER:PORT/DBNAME',
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
