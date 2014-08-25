'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

    /* thing.controller stub */
var thingCtrl = {
      index: 'thingCtrl.index'<% if(filters.mongoose) { %>,
      show: 'thingCtrl.show',
      create: 'thingCtrl.create',
      update: 'thingCtrl.update',
      destroy: 'thingCtrl.destroy'<% } %>
    },
    /* express.Router().router stub */
    router = {
      get: sinon.spy()<% if(filters.mongoose) { %>,
      put: sinon.spy(),
      patch: sinon.spy(),
      post: sinon.spy(),
      delete: sinon.spy()<% } %>
    },
    /* stubbed thing router */
    index = proxyquire('./index.js', {
      'express': {
        Router: function() {
          return router;
        }
      },
      './thing.controller': thingCtrl
    });

describe('Thing API Router:', function() {

  it('should return an express router instance', function() {
    index.should.equal(router);
  });

  describe('GET /api/things', function() {

    it('should route to thing.controller.index', function() {
      router.get.withArgs('/', 'thingCtrl.index').should.have.been.calledOnce;
    });

  });<% if(filters.mongoose) { %>

  describe('GET /api/things/:id', function() {

    it('should route to thing.controller.show', function() {
      router.get.withArgs('/:id', 'thingCtrl.show').should.have.been.calledOnce;
    });

  });

  describe('POST /api/things', function() {

    it('should route to thing.controller.create', function() {
      router.post.withArgs('/', 'thingCtrl.create').should.have.been.calledOnce;
    });

  });

  describe('PUT /api/things/:id', function() {

    it('should route to thing.controller.update', function() {
      router.put.withArgs('/:id', 'thingCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/things/:id', function() {

    it('should route to thing.controller.update', function() {
      router.patch.withArgs('/:id', 'thingCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/things/:id', function() {

    it('should route to thing.controller.destroy', function() {
      router.delete.withArgs('/:id', 'thingCtrl.destroy').should.have.been.calledOnce;
    });

  });<% } %>

});
