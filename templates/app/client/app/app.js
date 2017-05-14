import 'style-loader!./app.<%= styleExt %>';

import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// depending on the env mode, enable prod mode or add debugging modules
if(process.env.NODE_ENV === 'production') {
    enableProdMode();
}

import { AppModule } from './app.module';

export function main() {
    return platformBrowserDynamic().bootstrapModule(AppModule);
}

if(document.readyState === 'complete') {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}
