'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/<%= _.slugify(appname) %>-dev'
  },

  // Postgres connection options
  postgres: {
    uri: process.env.POSTGRES_URL ||
         'postgres://user:pass@localhost:5432/<%= _.slugify(appname) %>'
  },
  database: 'test',
  username: 'postgres',
  password: 'root',
  seedDB: true
};
