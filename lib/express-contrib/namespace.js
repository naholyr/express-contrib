
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

var ns = [],
    methods = express.router.methods.concat(['del', 'all']),
    previousRoutePath = '';

function current() {
  return ns.join("").replace(/\/$/, '') || '/';
}

Server.prototype.namespace = function(path, fn){
  ns.push(path);
  fn.call(this);
  ns.pop();
  return this;
};

/**
 * Proxy HTTP methods to provide namespacing support.
 */

methods.forEach(function(method){
  var orig = Server.prototype[method];

  Server.prototype[method] = function(){
    var args = arguments
      , fn = arguments[arguments.length - 1]
      , path = args[0];
    
    console.log("");
    console.log("length : ", args.length);
    console.log("path   : ", path);
    console.log("cur pre: ", current());
    
    if (path == previousRoutePath) {
      fn.namespace = args[0] = previousRoutePath;
      return orig.apply(this, args);
    }
    
    this.namespace(path, function() {
      console.log("cur pos: ", current());
      fn.namespace = path = current();
    });
    
    args[0] = previousRoutePath = path;
    
    return orig.apply(this, args);
  };

});
