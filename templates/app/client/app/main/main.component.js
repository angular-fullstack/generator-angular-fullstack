import { Component, OnInit<% if(filters.socketio) { %>, OnDestroy<% } %> } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../../components/socket/socket.service';

@Component({
    selector: 'main',
    template: require('./main.<%=templateExt%>'),
    styles: [require('./main.<%=styleExt%>')],
})
export class MainComponent implements OnInit<% if(filters.socketio) { %>, OnDestroy<% } %> {
  <%_ if(filters.socketio) { -%>
  SocketService;<% } %>
  awesomeThings = [];
  <%_ if(filters.models) { -%>
  newThing = '';<% } %>

  <%_ if(filters.babel) { -%>
  static parameters = [Http, SocketService];<% } %>
  constructor(<%= private() %>http: Http<% if(filters.socketio) { %>, <%= private() %>socketService: SocketService<% } %>) {
    this.Http = http;
    <%_ if(filters.socketio) { -%>
    this.SocketService = socketService;<% } %>
  }

  ngOnInit() {
    this.Http.get('/api/things')
      .map(res => {
        return res.json();
        <%_ if(filters.socketio) { -%>
        // this.SocketService.syncUpdates('thing', this.awesomeThings);<% } %>
      })
      .catch(err => Observable.throw(err.json().error || 'Server error'))
      .subscribe(things => {
        this.awesomeThings = things;
      });
  }<% if (filters.models) { %>
  <%_ if(filters.socketio) { %>

  ngOnDestroy() {
    this.SocketService.unsyncUpdates('thing');
  }<% } %>

  addThing() {
    if(this.newThing) {
      this.Http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.Http.delete(`/api/things/${thing._id}`);
  }<% } %>
}
