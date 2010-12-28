
/**
 * Module dependencies.
 */

var express = require('express')
  , Resource = require('express-contrib/resource')
  , contrib = require('express-contrib');

module.exports = {
  'test contrib export': function(assert){
    assert.equal(contrib.Resource, Resource);
  },
  
  'test app.resource()': function(assert){
    var app = express.createServer();

    var ret = app.resource('forums', require('./fixtures/forum'));
    assert.ok(ret instanceof Resource);

    assert.response(app,
      { url: '/forums' },
      { body: 'forum index' });
    
    assert.response(app,
      { url: '/forums/new' },
      { body: 'new forum' });
    
    assert.response(app,
      { url: '/forums', method: 'POST' },
      { body: 'create forum' });
    
    assert.response(app,
      { url: '/forums/5' },
      { body: 'show forum 5' });
    
    assert.response(app,
      { url: '/forums/5/edit' },
      { body: 'edit forum 5' });
    
    assert.response(app,
      { url: '/forums/5', method: 'PUT' },
      { body: 'update forum 5' });
    
    assert.response(app,
      { url: '/forums/5', method: 'DELETE' },
      { body: 'destroy forum 5' });
  },
  
  'test app.resource() id option': function(assert){
    var app = express.createServer();

    app.resource('users', {
      id: 'uid',
      show: function(req, res){
        res.send(req.params.uid);
      }
    });
  
    assert.response(app,
      { url: '/users' },
      { status: 404 });
    
    assert.response(app,
      { url: '/users/10' },
      { body: '10' });
  }
};