
/*!
 * Express - Contrib - Namespace
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
  fn();
  this._ns.pop();
  return this;
};

/**
 * Check if a namespace is currently applied.
 *
 * @return {Boolean}
 * @api private
 */

Server.prototype.__defineGetter__('isNamespaced', function(){
  return this._ns && this._ns.length;
});

/**
 * Proxy HTTP methods to provide namespacing support.
 */

(function(method){
  var orig = Server.prototype[method];
  Server.prototype[method] = function(path, fn){
    if (this.isNamespaced) {
      this._ns.push(path);
      path = join.apply(this, this._ns).replace(/\/$/, '');
      this._ns.pop();
    }
    orig.call(this, path, fn);
    return this;
  };
  return arguments.callee;
})('get')('post')('put')('del')('delete')('all');