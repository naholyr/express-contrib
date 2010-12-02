
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
 * Register a callback `fn(obj, done)` for the given `ext`.
 *
 * @param {String} ext
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.format = function(ext, fn){
  this._formats = this._formats || {};
  this._formats[ext] = fn;
  this._formats[ext].mime = mime.type(ext);
  return this;
};

http.ServerResponse.prototype.format = function(ext, fn){
  console.log(ext);
};

