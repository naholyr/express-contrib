
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

Server.prototype.format = function(ext, fn){
  console.log(ext);
};

http.ServerResponse.prototype.format = function(ext, fn){
  console.log(ext);
};
