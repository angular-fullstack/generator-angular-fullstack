var _ = require('lodash');
var path = require('path');
var prevnextPlugin = require('antwar-prevnext-plugin');
var markdown = require('./utilities/markdown');
var highlight = require('./utilities/highlight');

module.exports = {
  template: {
    title: 'geneartor-angular-fullstack',
    file: path.join(__dirname, 'template.ejs')
  },
  output: 'build',
  title: 'geneartor-angular-fullstack',
  keywords: ['geneartor-angular-fullstack', 'javascript', 'web development', 'yeoman', 'mean', 'angular', 'node'],
  pageTitle: function(config, pageTitle) {
    var siteName = config.name;

    if (pageTitle === 'index') {
      return siteName;
    }

    return siteName + ' - ' + pageTitle;
  },
  plugins: [
    prevnextPlugin()
  ],
  layout: function() {
    return require('./components/site/site.jsx').default
  },
  paths: {
    '/': root(
      function() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./content',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),

    'get-started': section(
      'Get-Started',
      function() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./content/get-started',
          false,
          /^\.\/.*\.md$/
        )
      }
    ),

    'guides': section(
      'Guides',
      function() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./content/guides',
          false,
          /^\.\/.*\.md$/
        )
      }
    ),

    developing: section(
      'Developing',
      function() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./content/developing',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),

    deployment: section(
      'Deployment',
      function() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./content/deployment',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),

    examples: section(
      'Examples',
      function() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./content/examples',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),

    generators: section(
      'Generators',
      function() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./content/generators',
          false,
          /^\.\/.*\.md$/
        );
      }
    ),
  }
};

function root(contentCb) {
  return {
    title: 'Webpack',
    path: function() { // Load path content
      return contentCb();
    },
    processPage: processPage(), // Process individual page (url, content)
    layouts: { // Layouts (page/section)
      index: function() {
        return require('./components/splash/splash.jsx').default
      },
      page: function() {
        return require('./components/page/page.jsx').default
      }
    },
    redirects: {} // Redirects <from>: <to>
  };
}

function section(title, contentCb) {
  return {
    title: title,
    path: function() {
      return contentCb();
    },
    sort(pages) {
      return _.sortBy(pages, (page) => page.file.sort)
    },
    processPage: processPage(),
    layouts: {
      index: function() {
        return require('./components/page/page.jsx').default
      },
      page: function() {
        return require('./components/page/page.jsx').default
      }
    },
    redirects: {} // <from>: <to>
  };
}

function processPage() {
  return {
    url: function(o) {
      return o.sectionName + '/' + o.fileName.split('.')[0]
    },
    content: function(o) {
      return markdown().process(o.file.__content, highlight);
    },
    anchors: function(o) {
      return markdown().getAnchors(o.file.__content);
    },
    contributors: function(o) {
      return Array.isArray(o.file.contributors) && o.file.contributors.length && o.file.contributors.slice().sort();
    }
  };
}

function combineContexts(context1, context2) {
  function webpackContext(req) {
    try {
      return context1(req);
    } catch (e) {
      return context2(req);
    }
  }
  webpackContext.keys = () => {
    let keys1 = context1.keys();
    let keys2 = context2.keys();
    return _.chain(keys1).concat(keys2).uniq().value();
  };
  return webpackContext;
}
