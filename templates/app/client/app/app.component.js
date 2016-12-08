import { Component } from '@angular/core';

export let AppComponent = @Component({
    selector: 'app',
    template: `<navbar></navbar>
    <ui-view></ui-view>
    <footer></footer>`
})
class AppComponent {}
