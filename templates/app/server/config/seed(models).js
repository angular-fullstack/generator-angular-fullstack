/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';<% if (filters.mongooseModels) { %>
import Thing from '../api/thing/thing.model';<% if (filters.auth) { %>
import User from '../api/user/user.model';<% } %><% } %><% if (filters.sequelizeModels) { %>
import { Thing<% if (filters.auth) { %>, User<% } %> } from '../sqldb';<% if (filters.auth) { %>
import Sequelize from 'sequelize';<% } %><% } %>
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    <% if (filters.mongooseModels) { %>Thing.find({}).remove()<% }
       if (filters.sequelizeModels) { %>return <% if (filters.auth) { %>Sequelize.Promise.all([
      <% } %>Thing.destroy({ where: {} })<% } %>
        .then(() =><% if (filters.mongooseModels) { %> {
          Thing.create({<% } if (filters.sequelizeModels) { %>
          Thing.bulkCreate([{<% } %>
            name: 'Development Tools',
            info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
                  + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
                  + 'Stylus, Sass, and Less.'
          }, {
            name: 'Server and Client integration',
            info: 'Built with a powerful and fun stack: MongoDB, Express, '
                  + 'AngularJS, and Node.'
          }, {
            name: 'Smart Build System',
            info: 'Build system ignores `spec` files, allowing you to keep '
                  + 'tests alongside code. Automatic injection of scripts and '
                  + 'styles into your index.html'
          }, {
            name: 'Modular Structure',
            info: 'Best practice client and server structures allow for more '
                  + 'code reusability and maximum scalability'
          }, {
            name: 'Optimized Build',
            info: 'Build process packs up your templates as a single JavaScript '
                  + 'payload, minifies your scripts/css/images, and rewrites asset '
                  + 'names for caching.'
          }, {
            name: 'Deployment Ready',
            info: 'Easily deploy your app to Heroku or Openshift with the heroku '
                  + 'and openshift subgenerators'
          }<% if (filters.sequelizeModels) { %>]<% } %>)<% if (filters.mongooseModels) { %>;
        }<% } %>)
        .then(() => console.log('seeded things'))<% if (filters.sequelizeModels && filters.auth) { %>,<% } if (filters.auth) { %>
    <% if (filters.mongooseModels) { %>User.find({}).remove()<% }
       if (filters.sequelizeModels) { %>  User.destroy({ where: {} })<% } %>
        .then(() =><% if (filters.mongooseModels) { %> {<% } %>
          <% if (filters.mongooseModels) { %>User.create({<% }
             if (filters.sequelizeModels) { %>User.bulkCreate([{<% } %>
            provider: 'local',
            name: 'Test User',
            email: 'test@example.com',
            password: 'test'
          }, {
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin'
        }<% if (filters.mongooseModels) { %>);
      })<% }
         if (filters.sequelizeModels) { %>])<% } %>
        .then(() => console.log('seeded users'))<% if (filters.sequelizeModels) { %>)])
      .then(() => console.log('seeded database'))<% } %><% } %>
      <% if (filters.sequelizeModels && !filters.auth) { %>  <% } %><% if (filters.mongooseModels) { %>  <% } %>.catch(err => console.log('Seeding error: ', err));
  }
}
