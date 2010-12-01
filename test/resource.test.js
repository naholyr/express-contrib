
/**
 * Module dependencies.
 */

var express = require('express')
  , Resource = require('express-resource')
  , contrib = require('express-contrib');

module.exports = {
  'test contrib export': function(assert){
    assert.equal(contrib.Resource, Resource);
  }
};