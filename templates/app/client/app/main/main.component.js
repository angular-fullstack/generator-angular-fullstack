import { Component, OnInit<% if(filters.ws) { %>, OnDestroy<% } %> } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../../components/socket/socket.service';

@Component({
    selector: 'main',
    template: require('./main.<%=templateExt%>'),
    styles: [require('./main.<%=styleExt%>')],
})
export class MainComponent implements OnInit<% if(filters.ws) { %>, OnDestroy<% } %> {
  <%_ if(filters.ws) { -%>
  SocketService;<% } %>
  awesomeThings = [];
  <%_ if(filters.models) { -%>
  newThing = '';<% } %>

  static parameters = [Http, SocketService];
  constructor(<%= private() %>http: Http<% if(filters.ws) { %>, <%= private() %>socketService: SocketService<% } %>) {
    this.Http = http;
    <%_ if(filters.ws) { -%>
    this.SocketService = socketService;<% } %>
  }

  ngOnInit() {
    this.Http.get('/api/things')
      .map(res => {
        return res.json();
      })
      .catch(err => Observable.throw(err.json().error || 'Server error'))
      .subscribe(things => {
        this.awesomeThings = things;
        <%_ if(filters.ws) { -%>
        this.SocketService.syncUpdates('thing', this.awesomeThings);<% } %>
      });
  }<% if (filters.models) { %>
  <%_ if(filters.ws) { %>

  ngOnDestroy() {
    this.SocketService.unsyncUpdates('thing');
  }<% } %>

  addThing() {
    if(this.newThing) {
      let text = this.newThing;
      this.newThing = '';

      return this.Http.post('/api/things', { name: text })
        .map(res => res.json())
        .catch(err => Observable.throw(err.json().error || 'Server error'))
        .subscribe(thing => {
          console.log('Added Thing:', thing);
        });
    }
  }

  deleteThing(thing) {
    return this.Http.delete(`/api/things/${thing._id}`)
      .map(res => res.json())
      .catch(err => Observable.throw(err.json().error || 'Server error'))
      .subscribe(() => {
        console.log('Deleted Thing');
      });
  }<% } %>
}
