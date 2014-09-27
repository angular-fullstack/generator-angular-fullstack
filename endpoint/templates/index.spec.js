'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var <%= cameledName %>CtrlStub = {
  index: '<%= name %>Ctrl.index'<% if(filters.mongoose) { %>,
  show: '<%= name %>Ctrl.show',
  create: '<%= name %>Ctrl.create',
  update: '<%= name %>Ctrl.update',
  destroy: '<%= name %>Ctrl.destroy'<% } %>
};

var routerStub = {
  get: sinon.spy()<% if(filters.mongoose) { %>,
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()<% } %>
};

// require the index with our stubbed out modules
var <%= cameledName %>Index = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './<%= name %>.controller': <%= cameledName %>CtrlStub
});

describe('<%= classedName %> API Router:', function() {

  it('should return an express router instance', function() {
    <%= cameledName %>Index.should.equal(routerStub);
  });

  describe('GET <%= route %>', function() {

    it('should route to <%= name %>.controller.index', function() {
      routerStub.get
                .withArgs('/', '<%= name %>Ctrl.index')
                .should.have.been.calledOnce;
    });

  });<% if(filters.mongoose) { %>

  describe('GET <%= route %>/:id', function() {

    it('should route to <%= name %>.controller.show', function() {
      routerStub.get
                .withArgs('/:id', '<%= name %>Ctrl.show')
                .should.have.been.calledOnce;
    });

  });

  describe('POST <%= route %>', function() {

    it('should route to <%= name %>.controller.create', function() {
      routerStub.post
                .withArgs('/', '<%= name %>Ctrl.create')
                .should.have.been.calledOnce;
    });

  });

  describe('PUT <%= route %>/:id', function() {

    it('should route to <%= name %>.controller.update', function() {
      routerStub.put
                .withArgs('/:id', '<%= name %>Ctrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('PATCH <%= route %>/:id', function() {

    it('should route to <%= name %>.controller.update', function() {
      routerStub.patch
                .withArgs('/:id', '<%= name %>Ctrl.update')
                .should.have.been.calledOnce;
    });

  });

  describe('DELETE <%= route %>/:id', function() {

    it('should route to <%= name %>.controller.destroy', function() {
      routerStub.delete
                .withArgs('/:id', '<%= name %>Ctrl.destroy')
                .should.have.been.calledOnce;
    });

  });<% } %>

});
