import { Component, OnInit<% if(filters.socketio) { %>, OnDestroy<% } %> } from '@angular/core';
import { Http } from '@angular/http';
import { SocketService } from '../../components/socket/socket.service';

@Component({
    selector: 'main',
    template: require('./main.<%=templateExt%>'),
    styles: [require('./main.<%=styleExt%>')],
})
export class MainComponent implements OnInit<% if(filters.socketio) { %>, OnDestroy<% } %> {
  Http;
  <%_ if(filters.socketio) { -%>
  SocketService;<% } %>
  awesomeThings = [];
  <%_ if(filters.models) { -%>
  newThing = '';<% } %>

  static parameters = [Http, SocketService];
  constructor(_Http_: Http<% if(filters.socketio) { %>, _SocketService_: SocketService<% } %>) {
    this.Http = _Http_;
    <%_ if(filters.socketio) { -%>
    this.SocketService = _SocketService_;<% } %>
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
    this.$http.delete('/api/things/' + thing._id);
  }<% } %>
}
