'use strict';

(function() {

/**
 * The Util service is for thin, globally reusable, utility functions
 */
function UtilService($window) {
  var Util = {
    /**
     * Return a callback or noop function
     *
     * @param  {Function|*} cb - a 'potential' function
     * @return {Function}
     */
    safeCb(cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    },

    /**
     * Parse a given url with the use of an anchor element
     *
     * @param  {String} url - the url to parse
     * @return {Object}     - the parsed url, anchor element
     */
    urlParse(url) {
      var a = document.createElement('a');
      a.href = url;

      // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
      if (a.host === '') {
        a.href = a.href;
      }

      return a;
    },

    /**
     * Test whether or not a given url is same origin
     *
     * @param  {String}           url       - url to test
     * @param  {String|String[]}  [origins] - additional origins to test against
     * @return {Boolean}                    - true if url is same origin
     */
    isSameOrigin(url, origins) {
      url = Util.urlParse(url);
      origins = (origins && [].concat(origins)) || [];
      origins = origins.map(Util.urlParse);
      origins.push($window.location);
      origins = origins.filter(function(o) {
        return url.hostname === o.hostname &&
          // 2nd part of the special treatment for IE fix (see above):  
          // This part is when using well-known ports 80 or 443 with IE, when $window.location.port==='' instead of the real port number. Probably the same cause as this IE bug:  
          // https://connect.microsoft.com/IE/feedback/details/817343/ie11-scripting-value-of-htmlanchorelement-host-differs-between-script-created-link-and-link-from-document  
          (url.port === o.port || (o.port === '' && (url.port === '80' || url.port === '443'))) &&  
          url.protocol === o.protocol;
      });
      return (origins.length >= 1);
    }
  };

  return Util;
}

angular.module('<%= scriptAppName %>.util')
  .factory('Util', UtilService);

})();
