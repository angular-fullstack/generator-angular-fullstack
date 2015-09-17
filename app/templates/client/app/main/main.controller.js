'use strict';

(function() {

class MainController {

  constructor($http<% if (filters.socketio) { %>, $scope, socket<% } %>) {
    this.$http = $http;
    this.awesomeThings = [];

    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;<% if (filters.socketio) { %>
      socket.syncUpdates('thing', this.awesomeThings);<% } %>
    });<% if (filters.socketio) { %>

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });<% } %>
  }<% if (filters.models) { %>

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }<% } %>
}

angular.module('<%= scriptAppName %>')
  .controller('MainController', MainController);

})();
