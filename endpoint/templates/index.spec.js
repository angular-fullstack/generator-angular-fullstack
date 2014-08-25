'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

    /* <%= name %>.controller stub */
var <%= name %>Ctrl = {
      index: '<%= name %>Ctrl.index'<% if(filters.mongoose) { %>,
      show: '<%= name %>Ctrl.show',
      create: '<%= name %>Ctrl.create',
      update: '<%= name %>Ctrl.update',
      destroy: '<%= name %>Ctrl.destroy'<% } %>
    },
    /* express.Router().router stub */
    router = {
      get: sinon.spy()<% if(filters.mongoose) { %>,
      put: sinon.spy(),
      patch: sinon.spy(),
      post: sinon.spy(),
      delete: sinon.spy()<% } %>
    },
    /* stubbed <%= name %> router */
    index = proxyquire('./index.js', {
      'express': {
        Router: function() {
          return router;
        }
      },
      './<%= name %>.controller': <%= name %>Ctrl
    });

describe('<%= classedName %> API Router:', function() {

  it('should return an express router instance', function() {
    index.should.equal(router);
  });

  describe('GET <%= route %>', function() {

    it('should route to <%= name %>.controller.index', function() {
      router.get.withArgs('/', '<%= name %>Ctrl.index').should.have.been.calledOnce;
    });

  });<% if(filters.mongoose) { %>

  describe('GET <%= route %>/:id', function() {

    it('should route to <%= name %>.controller.show', function() {
      router.get.withArgs('/:id', '<%= name %>Ctrl.show').should.have.been.calledOnce;
    });

  });

  describe('POST <%= route %>', function() {

    it('should route to <%= name %>.controller.create', function() {
      router.post.withArgs('/', '<%= name %>Ctrl.create').should.have.been.calledOnce;
    });

  });

  describe('PUT <%= route %>/:id', function() {

    it('should route to <%= name %>.controller.update', function() {
      router.put.withArgs('/:id', '<%= name %>Ctrl.update').should.have.been.calledOnce;
    });

  });

  describe('PATCH <%= route %>/:id', function() {

    it('should route to <%= name %>.controller.update', function() {
      router.patch.withArgs('/:id', '<%= name %>Ctrl.update').should.have.been.calledOnce;
    });

  });

  describe('DELETE <%= route %>/:id', function() {

    it('should route to <%= name %>.controller.destroy', function() {
      router.delete.withArgs('/:id', '<%= name %>Ctrl.destroy').should.have.been.calledOnce;
    });

  });<% } %>

});
