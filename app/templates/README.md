# <%= _.slugify(_.humanize(appname)) %>

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version <%= pkg.version %>.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and NPM](nodejs.org) >= v0.10.0
- [Bower](bower.io) (`npm install --global bower`)<% if(filters.sass) { %>
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`<% } if(filters.grunt) { %>
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)<% } if(filters.gulp) { %>
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)<% } if(filters.babel) { %>
- [Babel](https://babeljs.io) (`npm install --global babel`)<% } if(filters.mongoose) { %>
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`<% } if(filters.sequelize) { %>
- [SQLite](https://www.sqlite.org/quickstart.html)<% } %>

### Developing<% var i = 1; %>

<%= i++ %>. Run `npm install` to install server dependencies.

<%= i++ %>. Run `bower install` to install front-end dependencies.<% if(filters.mongoose) { %>

<%= i++ %>. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running<% } %>

<%= i++ %>. Run <% if(filters.grunt) { %>`grunt serve`<% } if(filters.grunt && filters.gulp) { %> or <% } if(filters.gulp) { %>`gulp serve`<% } %> to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
