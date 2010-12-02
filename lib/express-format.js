
/*!
 * Express - Contrib - Format
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , extname = require('path').extname
  , Server = express.Server
  , http = require('http')
  , url = require('url');

// TODO: memoization
// TODO: document "default format" setting (.html)

/**
 * Memory cache.
 */

var cache = {};

/**
 * Default formats.
 */

var defaultFormats = {
  '.json': function(req, res, next, obj){
    res.send(JSON.stringify(obj));
  },
  
  '.txt': function(req, res, next, obj){
    res.send(String(obj));
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

/**
 * Return request pathname format.
 *
 * @return {String}
 * @api public
 */

http.IncomingMessage.prototype.__defineGetter__('format', function(){
  return cache[this.url]
    || (cache[this.url] = extname(url.parse(this.url).pathname));
});

/**
 * Respond with format `ext` with optional callback `fn(req, res, next, ...)`
 * followed by arbitrary additional arguments.
 *
 * @param {String} ext
 * @param {Function} fn
 * @param {Mixed} ...
 * @return {ServerResponse} for chaining
 * @api public
 */

http.ServerResponse.prototype.format = function(ext, fn, obj){
  // Normalize "json" -> ".json"
  if ('.' != ext[0]) ext = '.' + ext;

  // Defaults
  var i = 1
    , format = this.app._formats[ext]
    , req = this.req
    , next = req.next
    , defaultFormat = this.app.settings['default format'] || '.html';


  // Default format
  if ('function' == typeof ext) {
    fn = ext;
    ext = defaultFormat;
  }

  // Match formats when the request format is present
  if (req.format && ext != req.format) return this;

  // Otherwise check Accept
  if (!req.accepts(ext.substr(1))) return this;

  // Custom callback passed
  if ('function' == typeof fn) {
    format = fn;
    ++i;
  }

  // Prep args
  var args = [req, this, next]
    .concat(Array.prototype.slice.call(arguments, i));

  // Ensure valid formatter
  if ('function' != typeof format) {
    throw new Error('undefined formatter for "' + ext + '"');
  }

  // Set Content-Type
  this.contentType(ext);

  // Format
  try {
    format.apply(this, args);
  } catch (err) {
    next(err);
  }

  return this;
};

