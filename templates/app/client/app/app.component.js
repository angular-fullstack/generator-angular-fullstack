import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `<navbar #navbar></navbar>
    <div (click)="navbar.collapse()">

    <% if (filters.ngroute) { %><router-outlet></router-outlet><% } %><% if (filters.uirouter) { %><ui-view></ui-view><% } %>

    <footer></footer>
    </div>`
})
export class AppComponent {}
