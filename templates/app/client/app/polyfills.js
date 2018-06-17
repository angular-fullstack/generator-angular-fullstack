// Enable certain polyfills depending on which browsers you need to support
// import 'core-js/es6';
// import 'core-js/es7/reflect';

import 'zone.js/dist/zone';

<%_ if(filters.ts) { -%>
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
    <%_ if(filters.ts) { %>
    (<IPolyFillErrorConstructor>Error).stackTraceLimit = Infinity;<% } else { %>
    Error.stackTraceLimit = Infinity;
    <% } %>
    // require('zone.js/dist/long-stack-trace-zone');
}
