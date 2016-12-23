import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `<navbar></navbar>
    <ui-view></ui-view>
    <footer></footer>`
})
export class AppComponent {}
