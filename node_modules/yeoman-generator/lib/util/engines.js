'use strict';
var _ = require('lodash');

// TODO(mklabs):
// - handle cache
// - implement adpaters for others engines (but do not add hard deps on them,
// should require manual install for anything that is not an underscore
// template)
// - put in multiple files, possibly other packages.

var engines = module.exports;

// Underscore
// ----------

// Underscore templates facade.
//
// Special kind of markers `<%%` for opening tags can be used to escape the
// placeholder opening tag. This is often useful for templates including
// snippet of templates you don't want to be interpolated.

engines.underscore = function underscore(source, data, options) {
  source = source.replace(engines.underscore.options.matcher, function (m, content) {
    // let's add some funny markers to replace back when templating is done,
    // should be fancy enough to reduce frictions with files using markers like
    // this already.
    return '(;>%%<;)' + content + '(;>%<;)';
  });

  //let the user an option to use settings of _.template
  source = _.template(source, null, options)(data);

  source = source
    .replace(/\(;>%%<;\)/g, engines.underscore.options.start)
    .replace(/\(;>%<;\)/g, engines.underscore.options.end);

  return source;
};

engines.underscore.options = {
  matcher: /<%%([^%]+)%>/g,
  detecter: /<%%?[^%]+%>/,
  start: '<%',
  end: '%>'
};

engines.underscore.detect = function detect(body) {
  return engines.underscore.options.detecter.test(body);
};
