'use strict';

var app = require('../../app');
var request = require('supertest');<% if(filters.mongoose) { %>

var new<%= classedName %>;<% } %>

describe('<%= classedName %> API:', function() {

  describe('GET <%= route %>', function() {
    var <%= name %>s;

    beforeEach(function(done) {
      request(app)
        .get('<%= route %>')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          <%= name %>s = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      <%= name %>s.should.be.instanceOf(Array);
    });

  });<% if(filters.mongoose) { %>

  describe('POST <%= route %>', function() {
    beforeEach(function(done) {
      request(app)
        .post('<%= route %>')
        .send({
          name: 'New <%= classedName %>',
          info: 'This is the brand new <%= name %>!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          new<%= classedName %> = res.body;
          done();
        });
    });

    it('should respond with the newly created <%= name %>', function() {
      new<%= classedName %>.name.should.equal('New <%= classedName %>');
      new<%= classedName %>.info.should.equal('This is the brand new <%= name %>!!!');
    });

  });

  describe('GET <%= route %>/:id', function() {
    var <%= name %>;

    beforeEach(function(done) {
      request(app)
        .get('<%= route %>/' + new<%= classedName %>._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          <%= name %> = res.body;
          done();
        });
    });

    afterEach(function() {
      <%= name %> = {};
    });

    it('should respond with the requested <%= name %>', function() {
      <%= name %>.name.should.equal('New <%= classedName %>');
      <%= name %>.info.should.equal('This is the brand new <%= name %>!!!');
    });

  });

  describe('PUT <%= route %>/:id', function() {
    var updated<%= classedName %>

    beforeEach(function(done) {
      request(app)
        .put('<%= route %>/' + new<%= classedName %>._id)
        .send({
          name: 'Updated <%= classedName %>',
          info: 'This is the updated <%= name %>!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          updated<%= classedName %> = res.body;
          done();
        });
    });

    afterEach(function() {
      updated<%= classedName %> = {};
    });

    it('should respond with the updated <%= name %>', function() {
      updated<%= classedName %>.name.should.equal('Updated <%= classedName %>');
      updated<%= classedName %>.info.should.equal('This is the updated <%= name %>!!!');
    });

  });

  describe('DELETE <%= route %>/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('<%= route %>/' + new<%= classedName %>._id)
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should respond with 404 when <%= name %> does not exsist', function(done) {
      request(app)
        .delete('<%= route %>/' + new<%= classedName %>._id)
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

  });<% } %>

});
