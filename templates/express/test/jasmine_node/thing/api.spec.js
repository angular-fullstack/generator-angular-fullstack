'use strict';

var app = require('../../../server'),
    request = require('supertest');

describe('GET /api/awesomeThings', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/awesomeThings')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceof(Array);
        done();
      });
  });
});