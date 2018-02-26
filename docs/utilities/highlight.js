'use strict';

if(typeof document !== "undefined") {
  // disable automatic highlight on content loaded
  var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
  script.setAttribute("data-manual", "");
}

var Prism = require('prismjs');
var languages = require('prism-languages');

var highlight = Prism.highlight;

module.exports = function(code, language) {
  language = language || 'bash';

  if (language === 'sh' || language === 'text') {
    language = 'bash';
  }

  try {
    return highlight(code, languages[language]);

  } catch (error) {
    if (!languages[language]) {
      console.warn('Prism does not support this language: ', language);

    } else console.warn('Prism failed to highlight: ', error);
  }

  return code;
};
