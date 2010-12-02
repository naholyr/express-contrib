
/*!
 * Express - Contrib - Format
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , Server = express.Server
  , http = require('http');

/**
 * Default formats.
 */

var defaultFormats = {
  '.json': function(req, res, next, obj){
    try {
      res.send(JSON.stringify(obj));
    } catch (err) {
      next(err);
    }
  }
};

/**
 * Expose default formats.
 */

Server.prototype._formats = defaultFormats;

/**
 * Register a format callback `fn` for the given `ext`.
 *
 * @param {String} ext
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.format = function(ext, fn){
  this._formats[ext] = fn;
  return this;
};

http.ServerResponse.prototype.format = function(ext, fn, obj){
  var i = 1
    , format = this.app._formats[ext];

  // Custom callback passed
  if ('function' == typeof fn) {
    format = fn;
    ++i;
  }

  // Prep args
  var args = [this.req, this, this.req.next]
    .concat(Array.prototype.slice.call(arguments, i));

  // Ensure valid formatter
  if ('function' != typeof format) {
    throw new Error('undefined formatter ' + ext);
  }

  // Set Content-Type
  this.contentType(ext);

  // Format
  format.apply(this, args);
};

