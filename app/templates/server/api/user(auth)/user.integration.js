'use strict';

var app = require('../../app');<% if (filters.mongooseModels) { %>
var User = require('./user.model');<% } %><% if (filters.sequelizeModels) { %>
var User = require('../../sqldb').User;<% } %>
var request = require('supertest');

describe('User API:', function() {
  var user;

  // Clear users before testing
  before(function(done) {
    <% if (filters.mongooseModels) { %>User.remove(function() {<% }
       if (filters.sequelizeModels) { %>User.destroy({where: {}}).then(function() {<% } %>
      <% if (filters.mongooseModels) { %>user = new User({<% }
         if (filters.sequelizeModels) { %>user = User.build({<% } %>
        name: 'Fake User',
        email: 'test@test.com',
        password: 'password'
      });

      <% if (filters.mongooseModels) { %>user.save(function(err) {
        if (err) {
          return done(err);
        }
        done();
      });<% }
         if (filters.sequelizeModels) { %>user.save().then(function() {
        done();
      }, function(err) {
        return done(err);
      });<% } %>
    });
  });

  // Clear users after testing
  after(function() {
    <% if (filters.mongooseModels) { %>return User.remove().exec();<% }
       if (filters.sequelizeModels) { %>return User.destroy({where: {}});<% } %>
  });

  describe('GET /api/users/me', function() {
    var token;

    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test@test.com',
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
          res.body._id.toString().should.equal(user._id.toString());
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
