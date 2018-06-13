import { Component, OnInit<% if(filters.ws) { %>, OnDestroy<% } %> } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';<% if(filters.ws) { %>
import { SocketService } from '../../components/socket/socket.service';<% } %>

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

    static parameters = [HttpClient<% if(filters.ws) { %>, SocketService<% } %>];
    constructor(<%= private() %>http: HttpClient<% if(filters.ws) { %>, <%= private() %>socketService: SocketService<% } %>) {
        this.http = http;
        <%_ if(filters.ws) { -%>
        this.SocketService = socketService;<% } %>
    }

    ngOnInit() {
        return this.http.get('/api/things')
            .subscribe(things => {
                this.awesomeThings = things;<% if(filters.ws) { %>
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

            return this.http.post('/api/things', { name: text })
                .subscribe(thing => {
                    console.log('Added Thing:', thing);
                });
        }
    }

    deleteThing(thing) {
        return this.http.delete(`/api/things/${thing._id}`)
            .subscribe(() => {
                console.log('Deleted Thing');
            });
    }<% } %>
}
