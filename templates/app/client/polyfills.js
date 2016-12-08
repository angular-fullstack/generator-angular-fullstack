// Polyfills
// (these modules are what are in 'angular2/bundles/angular2-polyfills' so don't use that here)

// import 'ie-shim'; // Internet Explorer
// import 'es6-shim';
// import 'es6-promise';
// import 'es7-reflect-metadata';

// Prefer CoreJS over the polyfills above
import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

<%_ if(filters.ts) { _%>
// Typescript emit helpers polyfill
import 'ts-helpers';

interface IPolyFillErrorConstructor extends ErrorConstructor {
    stackTraceLimit: any;
}<% } %>

if(!ENV) {
    var ENV = 'development';
}

if(ENV === 'production') {
    // Production
} else {
    // Development
    
    <%_ if(filters.ts) { _%>
    (<IPolyFillErrorConstructor>Error).stackTraceLimit = Infinity;<% } else { %>
    Error.stackTraceLimit = Infinity;    
    <% } %>
    // require('zone.js/dist/long-stack-trace-zone');
}
