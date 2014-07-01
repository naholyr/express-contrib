
/*!
 * Express - Contrib - configure
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , HTTPServer = express.HTTPServer;

// Proxy listen

var listen = HTTPServer.prototype.listen;

/**
 * Proxy listen() to provide async support.
 *
 * @api public
 */

HTTPServer.prototype.listen = function(){
  if (this.__config) {
    this.__listen = arguments;
  } else {
    listen.apply(this, arguments);
  }
};

// Proxy listenFD

var listenFD = HTTPServer.prototype.listenFD;

/**
 * Proxy listen() to provide async support.
 *
 * @api public
 */

HTTPServer.prototype.listenFD = function(){
  if (this.__config) {
    this.__listenFD = arguments;
  } else {
    listenFD.apply(this, arguments);
  }
};

// Proxy configure

var configure = HTTPServer.prototype.configure;

/**
 * Proxy configure() to provide async support.
 *
 * @api public
 */

HTTPServer.prototype.configure = function(env, fn){
  var self = this;
  this.__config = this.__config || 0

  if (typeof env === 'function') {
    fn = env, env = 'all';
  }

  if ('all' == env || env == this.settings.env) {
    if (fn.length) {
      ++this.__config;
      fn.call(this, function(err){
        if (err) throw err;
        if (!--self.__config) {
          if (self.__listen) {
            listen.apply(self, self.__listen);
          } else if (self.__listenFD) {
            listenFD.apply(self, self.__listenFD);
          }
        }
      });
    } else {
      fn.call(this);
    }
  }
  return this;
};
