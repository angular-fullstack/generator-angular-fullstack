'use strict';

import app from '../..';<% if (filters.mongooseModels) { %>
import User from './user.model';<% } %><% if (filters.sequelizeModels) { %>
import {User} from '../../sqldb';<% } %>
import request from 'supertest';

describe('User API:', function() {
  var user;

  // Clear users before testing
  before(function() {
    return <% if (filters.mongooseModels) { %>User.removeAsync().then(function() {<% }
       if (filters.sequelizeModels) { %>User.destroy({ where: {} }).then(function() {<% } %>
      <% if (filters.mongooseModels) { %>user = new User({<% }
         if (filters.sequelizeModels) { %>user = User.build({<% } %>
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return <% if (filters.mongooseModels) { %>user.saveAsync();<% }
         if (filters.sequelizeModels) { %>user.save();<% } %>
    });
  });

  // Clear users after testing
  after(function() {
    <% if (filters.mongooseModels) { %>return User.removeAsync();<% }
       if (filters.sequelizeModels) { %>return User.destroy({ where: {} });<% } %>
  });

  describe('GET /api/users/me', function() {
    var token;

    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          token = res.body.token;
          done();
        });
    });

    it('should respond with a user profile when authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          <%= expect() %>res.body._id.toString()<%= to() %>.equal(user._id.toString());
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });
});
