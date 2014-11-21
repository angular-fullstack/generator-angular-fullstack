
/**
 * Expose `Ware`.
 */

module.exports = Ware;

/**
 * Initialize a new `Ware` manager, with optional `fns`.
 *
 * @param {Function or Array or Ware} fn (optional)
 */

function Ware (fn) {
  if (!(this instanceof Ware)) return new Ware(fn);
  this.fns = [];
  if (fn) this.use(fn);
}

/**
 * Use a middleware `fn`.
 *
 * @param {Function or Array or Ware} fn
 * @return {Ware}
 */

Ware.prototype.use = function (fn) {
  if (fn instanceof Ware) {
    return this.use(fn.fns);
  }

  if (fn instanceof Array) {
    for (var i = 0, f; f = fn[i]; i++) this.fns.push(f);
    return this;
  }

  this.fns.push(fn);
  return this;
};

/**
 * Run through the middleware with the given `args` and optional `callback`.
 *
 * @param {Mixed} args...
 * @param {Function} callback (optional)
 * @return {Ware}
 */

Ware.prototype.run = function () {
  var fns = this.fns;
  var i = 0;
  var last = arguments[arguments.length - 1];
  var callback = 'function' == typeof last ? last : null;
  var args = callback
    ? [].slice.call(arguments, 0, arguments.length - 1)
    : [].slice.call(arguments);

  function next (err) {
    var fn = fns[i++];
    if (!fn) return callback && callback.apply(null, [err].concat(args));

    if (fn.length < args.length + 2 && err) return next(err);
    if (fn.length == args.length + 2 && !err) return next();

    var arr = [].slice.call(args);
    if (err) arr.unshift(err);
    arr.push(next);
    fn.apply(null, arr);
  }

  setTimeout(next, 0); // keep it always async
  return this;
};