
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
 * Namespace using the given `path`. Optionally providing a callback `fn()`,
 * which will be invoked immediately, resetting the namespace to the previous.
 *
 * @param {String} path
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.namespace = function(path, fn){
  this._namespace = path;
  if (fn) fn(), this._namespace = '/';
  return this;
};

/**
 * Proxy HTTP methods to provide namespacing support.
 */

(function(method){
  var orig = Server.prototype[method];
  Server.prototype[method] = function(path, fn){
    if (this._namespace) path = join(this._namespace, path);
    orig.call(this, path, fn);
    return this;
  };
  return arguments.callee;
})('get')('post')('put')('del')('delete')('all');