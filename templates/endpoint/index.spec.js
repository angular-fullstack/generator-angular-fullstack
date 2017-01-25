'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var <%= cameledName %>CtrlStub = {
  index: '<%= cameledName %>Ctrl.index'<% if(filters.models) { %>,
  show: '<%= cameledName %>Ctrl.show',
  create: '<%= cameledName %>Ctrl.create',
  upsert: '<%= cameledName %>Ctrl.upsert',
  patch: '<%= cameledName %>Ctrl.patch',
  destroy: '<%= cameledName %>Ctrl.destroy'<% } %>
};

var routerStub = {
  get: sinon.spy()<% if(filters.models) { %>,
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()<% } %>
};

// require the index with our stubbed out modules
var <%= cameledName %>Index = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './<%= basename %>.controller': <%= cameledName %>CtrlStub
});

describe('<%= classedName %> API Router:', function() {
  it('should return an express router instance', function() {
    <%= expect() %><%= cameledName %>Index<%= to() %>.equal(routerStub);
  });

  describe('GET <%= route %>', function() {
    it('should route to <%= cameledName %>.controller.index', function() {
      <%= expect() %>routerStub.get
        .withArgs('/', '<%= cameledName %>Ctrl.index')
        <%= to() %>.have.been.calledOnce;
    });
  });<% if(filters.models) { %>

  describe('GET <%= route %>/:id', function() {
    it('should route to <%= cameledName %>.controller.show', function() {
      <%= expect() %>routerStub.get
        .withArgs('/:id', '<%= cameledName %>Ctrl.show')
        <%= to() %>.have.been.calledOnce;
    });
  });

  describe('POST <%= route %>', function() {
    it('should route to <%= cameledName %>.controller.create', function() {
      <%= expect() %>routerStub.post
        .withArgs('/', '<%= cameledName %>Ctrl.create')
        <%= to() %>.have.been.calledOnce;
    });
  });

  describe('PUT <%= route %>/:id', function() {
    it('should route to <%= cameledName %>.controller.upsert', function() {
      <%= expect() %>routerStub.put
        .withArgs('/:id', '<%= cameledName %>Ctrl.upsert')
        <%= to() %>.have.been.calledOnce;
    });
  });

  describe('PATCH <%= route %>/:id', function() {
    it('should route to <%= cameledName %>.controller.patch', function() {
      <%= expect() %>routerStub.patch
        .withArgs('/:id', '<%= cameledName %>Ctrl.patch')
        <%= to() %>.have.been.calledOnce;
    });
  });

  describe('DELETE <%= route %>/:id', function() {
    it('should route to <%= cameledName %>.controller.destroy', function() {
      <%= expect() %>routerStub.delete
        .withArgs('/:id', '<%= cameledName %>Ctrl.destroy')
        <%= to() %>.have.been.calledOnce;
    });
  });<% } %>
});
