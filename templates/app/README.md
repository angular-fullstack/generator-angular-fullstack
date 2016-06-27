# <%= lodash.slugify(lodash.humanize(appname)) %>

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version <%= rootGeneratorVersion() %>.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.4.6, npm ^2.15.5
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)<% if(filters.mongoose) { %>
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`<% } if(filters.sequelize) { %>
- [SQLite](https://www.sqlite.org/quickstart.html)<% } %>

### Developing<% var i = 1; %>

<%= i++ %>. Run `npm install` to install server dependencies.

<%= i++ %>. Run `bower install` to install front-end dependencies.<% if(filters.mongoose) { %>

<%= i++ %>. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running<% } %>

<%= i++ %>. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.
Run `gulp build` for building and `gulp serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
