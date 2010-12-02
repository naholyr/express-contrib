
/*!
 * Express - Contrib - Format
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , mime = require('connect').utils.mime
  , Server = express.Server
  , http = require('http');

/**
 * Default formats.
 */

var defaultFormats = {
  '.json': function(obj, fn){
    fn(JSON.encode(obj));
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
  this._formats[ext].mime = mime.type(ext);
  return this;
};

http.ServerResponse.prototype.format = function(ext, fn){
  var format = this.app._formats[ext];
  console.log(format);
};

