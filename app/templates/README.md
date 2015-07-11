# <%= _.slugify(_.humanize(appname)) %>

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version <%= pkg.version %>.

## Getting Started

### Prerequisites

- [Node.js and NPM](nodejs.org) >= v0.10.0
- [Bower](bower.io) (`npm install --global bower`)<% if(filters.sass) { %>
- [Ruby](https://www.ruby-lang.org)<% } if(filters.grunt) { %>
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)<% } if(filters.gulp) { %>
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)<% } if(filters.babel) { %>
- [Babel](https://babeljs.io) (`npm install --global babel`)<% } if(filters.coffee) %>
- [CoffeeScript](http://coffeescript.org/) (`npm install -g coffee-script`)<% } if(filters.stylus) %>
- [Stylus](https://learnboost.github.io/stylus/) (`npm install --global stylus`)<% } if(filters.less) %>
- [Less](http://lesscss.org/) (`npm install --global less`)<% } if(filters.mongoose) %>
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`<% } if(filters.sequelize) %>
- [SQLite](https://www.sqlite.org/quickstart.html)<% } %>

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.