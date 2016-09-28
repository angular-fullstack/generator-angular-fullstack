import { Component, Inject } from '@angular/core';

export let MainComponent = @Component({
  selector: 'main',
  template: require('./main.html')
})
class MainComponent {
  $http;
  <%_ if(filters.socketio) { -%>
  socket;<% } %>
  awesomeThings = [];
  <%_ if(filters.models) { -%>
  newThing = '';<% } %>

  static parameters = ['$http'<% if(filters.socketio) { %>, 'socket'<% } %>];
  constructor(@Inject('$http') $http<% if(filters.socketio) { %>, @Inject('socket') socket<% } %>) {
    this.$http = $http;
    <%_ if(filters.socketio) { -%>
    this.socket = socket;<% } %>
  }

  ngOnInit() {
    this.$http.get('/api/things').then(response => {
      this.awesomeThings = response.data;<% if (filters.socketio) { %>
      this.socket.syncUpdates('thing', this.awesomeThings);<% } %>
    });
  }<%_ if(filters.socketio) { -%>

  ngOnDestroy() {
    this.socket.unsyncUpdates('thing');
  }<% } %><% if (filters.models) { %>

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

MainComponent.parameters = ['$http'<% if(filters.socketio) { %>, 'socket'<% } %>];
