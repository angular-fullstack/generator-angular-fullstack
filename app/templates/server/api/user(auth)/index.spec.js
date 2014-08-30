'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

    /* user.controller stub */
var userCtrl = {
      index: 'userCtrl.index',
      destroy: 'userCtrl.destroy',
      me: 'userCtrl.me',
      changePassword: 'userCtrl.changePassword',
      show: 'userCtrl.show',
      create: 'userCtrl.create'
    },
    /* auth.service stub */
    authService = {
      isAuthenticated: function() {
        return 'authService.isAuthenticated';
      },
      hasRole: function(role) {
        return 'authService.hasRole.' + role;
      }
    },
    /* express.Router().router stub */
    router = {
      get: sinon.spy(),
      put: sinon.spy(),
      post: sinon.spy(),
      delete: sinon.spy()
    },
    /* stubbed user router */
    index = proxyquire('./index', {
      'express': {
        Router: function() {
          return router;
        }
      },
      './user.controller': userCtrl,
      '../../auth/auth.service': authService
    });

describe('User API Router:', function() {

  it('should return an express router instance', function() {
    index.should.equal(router);
  });

  describe('GET /api/users', function() {

    it('should verify admin role and route to user.controller.index', function() {
      return router.get.withArgs('/', 'authService.hasRole.admin', 'userCtrl.index').should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/users/:id', function() {

    it('should verify admin role and route to user.controller.destroy', function() {
      return router.delete.withArgs('/:id', 'authService.hasRole.admin', 'userCtrl.destroy').should.have.been.calledOnce;
    });

  });

  describe('GET /api/users/me', function() {

    it('should be authenticated and route to user.controller.me', function() {
      return router.get.withArgs('/me', 'authService.isAuthenticated', 'userCtrl.me').should.have.been.calledOnce;
    });

  });

  describe('PUT /api/users/:id/password', function() {

    it('should be authenticated and route to user.controller.changePassword', function() {
      return router.put.withArgs('/:id/password', 'authService.isAuthenticated', 'userCtrl.changePassword').should.have.been.calledOnce;
    });

  });

  describe('GET /api/users/:id', function() {

    it('should be authenticated and route to user.controller.show', function() {
      return router.get.withArgs('/:id', 'authService.isAuthenticated', 'userCtrl.show').should.have.been.calledOnce;
    });

  });

  describe('POST /api/users', function() {

    it('should route to user.controller.create', function() {
      return router.post.withArgs('/', 'userCtrl.create').should.have.been.calledOnce;
    });

  });

});
