'use strict';

var app = require('<%= relativeRequire('server') %>');
import request from 'supertest';<% if(filters.models) { %>

var new<%= classedName %>;<% } %>

describe('<%= classedName %> API:', function() {

  after(function() {
    app.angularFullstack.close();
  });

  describe('GET <%= route %>', function() {
    var <%= cameledName %>s;

    beforeEach(function(done) {
      request(app)
        .get('<%= route %>')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          <%= cameledName %>s = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      <%= expect() %><%= cameledName %>s<%= to() %>.be.instanceOf(Array);
    });

  });<% if(filters.models) { %>

  describe('POST <%= route %>', function() {
    beforeEach(function(done) {
      request(app)
        .post('<%= route %>')
        .send({
          name: 'New <%= classedName %>',
          info: 'This is the brand new <%= cameledName %>!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          new<%= classedName %> = res.body;
          done();
        });
    });

    it('should respond with the newly created <%= cameledName %>', function() {
      <%= expect() %>new<%= classedName %>.name<%= to() %>.equal('New <%= classedName %>');
      <%= expect() %>new<%= classedName %>.info<%= to() %>.equal('This is the brand new <%= cameledName %>!!!');
    });

  });

  describe('GET <%= route %>/:id', function() {
    var <%= cameledName %>;

    beforeEach(function(done) {
      request(app)
        .get('<%= route %>/' + new<%= classedName %>._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          <%= cameledName %> = res.body;
          done();
        });
    });

    afterEach(function() {
      <%= cameledName %> = {};
    });

    it('should respond with the requested <%= cameledName %>', function() {
      <%= expect() %><%= cameledName %>.name<%= to() %>.equal('New <%= classedName %>');
      <%= expect() %><%= cameledName %>.info<%= to() %>.equal('This is the brand new <%= cameledName %>!!!');
    });

  });

  describe('PUT <%= route %>/:id', function() {
    var updated<%= classedName %>;

    beforeEach(function(done) {
      request(app)
        .put('<%= route %>/' + new<%= classedName %>._id)
        .send({
          name: 'Updated <%= classedName %>',
          info: 'This is the updated <%= cameledName %>!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updated<%= classedName %> = res.body;
          done();
        });
    });

    afterEach(function() {
      updated<%= classedName %> = {};
    });

    it('should respond with the updated <%= cameledName %>', function() {
      <%= expect() %>updated<%= classedName %>.name<%= to() %>.equal('Updated <%= classedName %>');
      <%= expect() %>updated<%= classedName %>.info<%= to() %>.equal('This is the updated <%= cameledName %>!!!');
    });

  });

  describe('DELETE <%= route %>/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('<%= route %>/' + new<%= classedName %>._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when <%= cameledName %> does not exist', function(done) {
      request(app)
        .delete('<%= route %>/' + new<%= classedName %>._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });<% } %>

});
