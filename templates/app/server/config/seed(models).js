/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';<% if(filters.mongooseModels) { %>
import Thing from '../api/thing/thing.model';<% if(filters.auth) { %>
import User from '../api/user/user.model';<% } %><% } %><% if(filters.sequelizeModels) { %>
import sqldb from '../sqldb';<% } %>
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(!config.seedDB) {
    return Promise.resolve();
  }

  <% if(filters.sequelizeModels) { %>let Thing = sqldb.Thing;<% if(filters.auth) { %>
  let User = sqldb.User;<% } %><% } %>

  let promises = [];

  let thingPromise = <% if(filters.mongooseModels) { %>Thing.find({}).remove()<% } if(filters.sequelizeModels) { %>Thing.destroy({ where: {} })<% } %>
    .then(() => {
      <% if(filters.mongooseModels) { %>return Thing.create({<% }
         if(filters.sequelizeModels) { %>return Thing.bulkCreate([{<% } %>
        name: 'Development Tools',
        info: 'Integration with popular tools such as Webpack, Babel, TypeScript, Karma, Mocha, ESLint, Protractor, '
              + 'Pug, Stylus, Sass, and Less.'
      }, {
        name: 'Server and Client integration',
        info: 'Built with a powerful and fun stack: MongoDB, Express, Angular, and Node.'
      }, {
        name: 'Smart Build System',
        info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of '
              + 'scripts and styles into your app.html'
      }, {
        name: 'Modular Structure',
        info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
      }, {
        name: 'Optimized Build',
        info: 'Build process packs up your templates as a single JavaScript payload, minifies your ' +
                'scripts/css/images, and rewrites asset names for caching.'
      }, {
        name: 'Deployment Ready',
        info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
      <% if(filters.mongooseModels) { %>});<% }
       if(filters.sequelizeModels) { %>}]);<% } %>
    })
    .then(() => console.log('finished populating things'))
    .catch(err => console.log('error populating things', err));
  promises.push(thingPromise);
<% if(filters.auth) { %>
  let userPromise = <% if(filters.mongooseModels) { %>User.find({}).remove()<% } if(filters.sequelizeModels) { %>User.destroy({ where: {} })<% } %>
    .then(() => {
      <% if(filters.mongooseModels) { %>return User.create({<% }
         if(filters.sequelizeModels) { %>return User.bulkCreate([{<% } %>
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
      <% if(filters.mongooseModels) { %>})<% }
        if(filters.sequelizeModels) { %>}])<% } %>
      .then(() => console.log('finished populating users'))
      .catch(err => console.log('error populating users', err));
    });
  promises.push(userPromise);<% } %>

  return Promise.all(promises);
}
