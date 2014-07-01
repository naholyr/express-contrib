
/*!
 * Express - Contrib - namespace
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , HTTPServer = express.HTTPServer
  , join = require('path').join;

/**
 * Namespace using the given `path`, providing a callback `fn()`,
 * which will be invoked immediately, resetting the namespace to the previous.
 *
 * @param {String} path
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

HTTPServer.prototype.namespace = function(path, fn){
  (this._ns = this._ns || []).push(path);
  fn.call(this);
  this._ns.pop();
  return this;
};


/**
 * Return the current namespace.
 *
 * @return {String}
 * @api public
 */

HTTPServer.prototype.__defineGetter__('currentNamespace', function(){
  return join.apply(this, this._ns).replace(/\/$/, '') || '/';
});


/**
 * Proxy HTTP methods to provide namespacing support.
 */

express.router.methods.concat(['del', 'all']).forEach(function(method){
  var orig = HTTPServer.prototype[method];

  HTTPServer.prototype[method] = function(){
    var args =  Array.prototype.slice.call(arguments)
      , path = args.shift()
      , fn = args.pop()
      , self = this;
    
    this.namespace(path, function() {
      var current = self.currentNamespace;

      // Remaining args are middleware.
      // If we let them pass through via `orig.apply(self, args)` they'll be
      // found by Express' server module which passes them BACK to this method,
      // which will then re-namespace them, breaking their routes. See the "if
      // (arguments.length > 2)" in the "generateMethod" function of Express'
      // "server.js" module.
      args.forEach(function(middleware) {
        middleware.namespace = current;
        orig.call(self, current, middleware);
      });

      fn.namespace = current;
      orig.call(self, current, fn);
    });
    
    return this;
  };
});
