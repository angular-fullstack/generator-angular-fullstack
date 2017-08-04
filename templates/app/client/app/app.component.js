import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `<navbar></navbar>
    <% if (filters.ngroute) { %><router-outlet></router-outlet><% } %><% if (filters.uirouter) { %><ui-view></ui-view><% } %>
    <footer></footer>`
})
export class AppComponent {}
