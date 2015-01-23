/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
<% if (filters.mongooseModels) { %>
var Thing = require('../api/thing/thing.model');
<% if (filters.auth) { %>var User = require('../api/user/user.model');<% } %>
<% } %><% if (filters.sequelizeModels) { %>
var sqldb = require('../sqldb');
var Thing = sqldb.Thing;
<% if (filters.auth) { %>var User = sqldb.User;<% } %>
<% } %>
<% if (filters.mongooseModels) { %>Thing.find({}).removeAsync()<% }
   if (filters.sequelizeModels) { %>Thing.sync()
  .then(function() {
    return Thing.destroy();
  })<% } %>
  .then(function() {
    <% if (filters.mongooseModels) { %>Thing.create({<% }
       if (filters.sequelizeModels) { %>Thing.bulkCreate([{<% } %>
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Karma, ' +
             'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
             'Stylus, Sass, CoffeeScript, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
             'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
             'tests alongside code. Automatic injection of scripts and ' +
             'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
             'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
             'payload, minifies your scripts/css/images, and rewrites asset ' +
             'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
             'and openshift subgenerators'
    <% if (filters.mongooseModels) { %>});<% }
       if (filters.sequelizeModels) { %>}]);<% } %>
  });
<% if (filters.auth) { %>
<% if (filters.mongooseModels) { %>User.find({}).removeAsync()<% }
   if (filters.sequelizeModels) { %>User.sync()
  .then(function() {
    User.destroy();
  })<% } %>
  .then(function() {
    <% if (filters.mongooseModels) { %>User.createAsync({<% }
       if (filters.sequelizeModels) { %>User.bulkCreate([{<% } %>
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    <% if (filters.mongooseModels) { %>})<% }
       if (filters.sequelizeModels) { %>}])<% } %>
    .then(function() {
      console.log('finished populating users');
    });
  });<% } %>
