// import angular from 'angular';
// // import ngAnimate from 'angular-animate';
// import ngCookies from 'angular-cookies';
// import ngResource from 'angular-resource';
// import ngSanitize from 'angular-sanitize';
// <%_ if(filters.socketio) { _%>
// import 'angular-socket-io';<% } %>
// <%_ if(filters.ngroute) { _%>
// const ngRoute = require('angular-route');<% } %>
// <%_ if(filters.uirouter) { _%>
// import uiRouter from 'angular-ui-router';<% } %>
// <%_ if(filters.uibootstrap) { _%>
// import uiBootstrap from 'angular-ui-bootstrap';<% } %>
// // import ngMessages from 'angular-messages';
// <%_ if(filters.auth) { _%>
// // import ngValidationMatch from 'angular-validation-match';<% } %>

// import {routeConfig} from './app.config';

// <%_ if(filters.auth) { _%>
// import _Auth from '../components/auth/auth.module';
// import account from './account';
// import admin from './admin';<% } %>
// import navbar from '../components/navbar/navbar.component';
// import footer from '../components/footer/footer.component';
// import main from './main/main.component';
// import constants from './app.constants';
// import util from '../components/util/util.module';
// <%_ if(filters.socketio) { _%>
// import socket from '../components/socket/socket.service';<% } %>

//   .config(routeConfig)
//   <%_ if(filters.auth) { _%>
//   .run(function($rootScope, $location, Auth) {
//     'ngInject';
//     // Redirect to login if route requires auth and you're not logged in
//     $rootScope.$on('$stateChangeStart', function(event, next) {
//       Auth.isLoggedIn(function(loggedIn) {
//         if(next.authenticate && !loggedIn) {
//           $location.path('/login');
//         }
//       });
//     });
//   })<% } %>;


import {
  NgModule,
  ErrorHandler,
  Injectable,
  ApplicationRef,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpModule,
  BaseRequestOptions,
  RequestOptions,
  RequestOptionsArgs,
} from '@angular/http';
import {
  removeNgStyles,
  createNewHosts,
  disposeOldHosts,
  createInputTransfer,
  restoreInputValues,
} from '@angularclass/hmr';
<%_ if (filters.uirouter) { -%>
import { UIRouterModule } from 'ui-router-ng2';<% } %>
<%_ if (filters.ngroute) { -%>
import { RouterModule, Routes } from '@angular/router';<% } %>
import { provideAuth } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { MainComponent } from './main/main.component';
import { DirectivesModule } from '../components/directives.module';
import { AccountModule } from './account/account.module';
//import { AdminModule } from './admin/admin.module';

import constants from './app.constants';

let providers = [
  provideAuth({
    // Allow using AuthHttp while not logged in
    noJwtError: true,
  })
];

if(constants.env === 'development') {
  @Injectable()
  class HttpOptions extends BaseRequestOptions {
    merge(options/*:RequestOptionsArgs*/)/*:RequestOptions*/ {
      options.url = `http://localhost:9000${options.url}`;
      return super.merge(options);
    }
  }

  providers.push({ provide: RequestOptions, useClass: HttpOptions });
}

const appRoutes: Routes = [
  //{ path: 'crisis-center', component: CrisisListComponent },
  //{ path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'home',
    component: MainComponent,
    data: { title: 'Home' }
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
    providers,
    imports: [
        BrowserModule,
        HttpModule,
        <%_ if (filters.uirouter) { -%>
        UIRouterModule.forRoot(),<% } %>
        <%_ if (filters.ngroute) { -%>
        RouterModule.forRoot(appRoutes, { enableTracing: true }),<% } %>
        MainModule,
        DirectivesModule,
        AccountModule,
        //AdminModule,
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  static parameters = [ApplicationRef];
  constructor(appRef/*: ApplicationRef*/) {
    this.appRef = appRef;
  }

  hmrOnInit(store) {
    if (!store || !store.state) return;
    console.log('HMR store', store);
    console.log('store.state.data:', store.state.data)
    // inject AppStore here and update it
    // this.AppStore.update(store.state)
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // change detection
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store) {
    var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation)
    // inject your AppStore and grab state then set it on store
    // var appState = this.AppStore.get()
    store.state = {data: 'yolo'};
    // store.state = Object.assign({}, appState)
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts()
    delete store.disposeOldHosts;
    // anything you need done the component is removed
  }
}
