import {
    NgModule,
    Injectable,
    ApplicationRef,<% if(filters.ts || filters.flow) { %>
    Provider,<% } %>
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    Http,
    HttpModule,
    BaseRequestOptions,<% if(filters.ts || filters.flow) { %>
    RequestOptions,
    RequestOptionsArgs,<% } %>
} from '@angular/http';
import {
    removeNgStyles,
    createNewHosts,
    createInputTransfer,
} from '@angularclass/hmr';
<%_ if (filters.uirouter) { -%>
import { UIRouterModule } from 'ui-router-ng2';<% } %>
<%_ if (filters.ngroute) { -%>
import { RouterModule, Routes } from '@angular/router';<% } %>
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { DirectivesModule } from '../components/directives.module';<% if(filters.auth) { %>
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';<% } %>

import constants from './app.constants';

export function getAuthHttp(http) {
    return new AuthHttp(new AuthConfig({
        noJwtError: true,
        globalHeaders: [{'Accept': 'application/json'}],
        tokenGetter: (() => localStorage.getItem('id_token')),
    }), http);
}

let providers: Provider[] = [{
    provide: AuthHttp,
    useFactory: getAuthHttp,
    deps: [Http]
}];

if(constants.env === 'development') {
    @Injectable()
    class HttpOptions extends BaseRequestOptions {
        merge(options: RequestOptionsArgs): RequestOptions {
            options.url = `http://localhost:9000${options.url}`;
            return super.merge(options);
        }
    }

    providers.push({ provide: RequestOptions, useClass: HttpOptions });
}

const appRoutes: Routes = [{ path: '',
    redirectTo: '/home',
    pathMatch: 'full'
}];

@NgModule({
    providers,
    imports: [
        BrowserModule,
        HttpModule,
        <%_ if (filters.uirouter) { -%>
        UIRouterModule.forRoot(),<% } %>
        <%_ if (filters.ngroute) { -%>
        RouterModule.forRoot(appRoutes, { enableTracing: process.env.NODE_ENV === 'development' }),<% } %>
        MainModule,
        DirectivesModule,<% if(filters.auth) { %>
        AccountModule,
        AdminModule,<% } %>
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    static parameters = [ApplicationRef];
    constructor(<%= private() %>appRef: ApplicationRef) {
        this.appRef = appRef;
    }

    hmrOnInit(store) {
        if (!store || !store.state) return;
        console.log('HMR store', store);
        console.log('store.state.data:', store.state.data);
        // inject AppStore here and update it
        // this.AppStore.update(store.state)
        if ('restoreInputValues' in store) {
            store.restoreInputValues();
        }
        // change detection
        this.appRef.tick();
        Reflect.deleteProperty(store, 'state');
        Reflect.deleteProperty(store, 'restoreInputValues');
    }

    hmrOnDestroy(store) {
        var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // inject your AppStore and grab state then set it on store
        // var appState = this.AppStore.get()
        store.state = {data: 'yolo'};
        // store.state = Object.assign({}, appState)
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    hmrAfterDestroy(store) {
        // display new elements
        store.disposeOldHosts();
        Reflect.deleteProperty(store, 'disposeOldHosts');
        // anything you need done the component is removed
    }
}
