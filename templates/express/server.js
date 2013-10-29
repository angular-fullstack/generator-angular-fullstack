/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , routes = require('./server/routes');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());  
} 
// production only
else {
  app.use(express.static(path.join(__dirname, 'dist')));
}

app.get('/api/awesomeThings', routes.awesomeThings);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});