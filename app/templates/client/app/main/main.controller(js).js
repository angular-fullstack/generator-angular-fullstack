'use strict';

(function() {

function MainController($scope, $http<% if (filters.socketio) { %>, socket<% } %>) {
  var self = this;
  this.awesomeThings = [];

  $http.get('/api/things').then(function(response) {
    self.awesomeThings = response.data;<% if (filters.socketio) { %>
    socket.syncUpdates('thing', self.awesomeThings);<% } %>
  });<% if (filters.models) { %>

  this.addThing = function() {
    if (self.newThing === '') {
      return;
    }
    $http.post('/api/things', { name: self.newThing });
    self.newThing = '';
  };

  this.deleteThing = function(thing) {
    $http.delete('/api/things/' + thing._id);
  };<% } if (filters.socketio) { %>

  $scope.$on('$destroy', function() {
    socket.unsyncUpdates('thing');
  });<% } %>
}

angular.module('<%= scriptAppName %>')
  .controller('MainController', MainController);

})();
