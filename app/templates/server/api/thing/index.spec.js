'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var thingCtrlStub = {
  index: 'thingCtrl.index'<% if(filters.mongoose) { %>,
  show: 'thingCtrl.show',
  create: 'thingCtrl.create',
  update: 'thingCtrl.update',
  destroy: 'thingCtrl.destroy'<% } %>
};

var routerStub = {
  get: sinon.spy()<% if(filters.mongoose) { %>,
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()<% } %>
};

// require the index with our stubbed out modules
var thingIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './thing.controller': thingCtrlStub
});

describe('Thing API Router:', function() {

  it('should return an express router instance', function() {
    thingIndex.should.equal(routerStub);
  });

  describe('GET /api/things', function() {

    it('should route to thing.controller.index', function() {
      routerStub.get.withArgs('/', 'thingCtrl.index').should.have.been.calledOnce;
    });

  });<% if(filters.mongoose) { %>

  describe('GET /api/things/:id', function() {

    it('should route to thing.controller.show', function() {
      routerStub.get.withArgs('/:id', 'thingCtrl.show').should.have.been.calledOnce;
    });

  });

  describe('POST /api/things', function() {

    it('should route to thing.controller.create', function() {
      routerStub.post.withArgs('/', 'thingCtrl.create').should.have.been.calledOnce;
    });

  });

  describe('PUT /api/things/:id', function() {

    it('should route to thing.controller.update', function() {
      routerStub.put.withArgs('/:id', 'thingCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/things/:id', function() {

    it('should route to thing.controller.update', function() {
      routerStub.patch.withArgs('/:id', 'thingCtrl.update').should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/things/:id', function() {

    it('should route to thing.controller.destroy', function() {
      routerStub.delete.withArgs('/:id', 'thingCtrl.destroy').should.have.been.calledOnce;
    });

  });<% } %>

});
