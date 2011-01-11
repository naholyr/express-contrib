
/*!
 * Express - Contrib - namespace
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , Server = express.Server
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

Server.prototype.namespace = function(path, fn){
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

Server.prototype.__defineGetter__('currentNamespace', function(){
  return join.apply(this, this._ns).replace(/\/$/, '') || '/';
});

/**
 * Proxy HTTP methods to provide namespacing support.
 */

express.router.methods.concat(['del', 'all']).forEach(function(method){
  var orig = Server.prototype[method];
  Server.prototype[method] = function(){
    var args = arguments
      , fn = arguments[arguments.length - 1];
    this.namespace(args[0], function(){
      fn.namespace = args[0] = this.currentNamespace;
    });
    return orig.apply(this, args);
  };
});
