'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/<%= name %>s', function () {
    var id = 0;

    it('should respond with JSON array', function (done) {
        request(app)
            .get('/api/<%= name%>s')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                res.body.should.have.length(0);
                done();
            });
    });

    it('should create a new <%= name %>', function (done) {
        request(app)
            .post('/api/<%= name%>s')
            .send()
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('_id');
                id = res.body._id;
                done();
            });
    });

    it('should update a <%= name %>', function (done) {
        request(app)
            .put('/api/<%= name%>s/' + id)
            .send({})
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('_2id');
                done();
            });
    });

    it('should get a <%= name %>', function (done) {
        request(app)
            .get('/api/<%= name%>s/' + id)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.have.property('_id');
                done();
            });
    });

    it('should delete a <%= name %>', function (done) {
        request(app)
            .delete('/api/<%= name%>s/' + id)
            .expect(204)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});
