
/**
 * Module dependencies.
 */

var express = require('express')
  , contrib = require('express-contrib');

module.exports = {
  'test contrib export': function(assert){
    assert.equal(contrib.route, route);
  },

  'test app.namespace(str, fn)': function(assert){
    var app = express.createServer();

    app.get('/one', function(req, res){
      res.send('GET one');
    });

    app.namespace('/user', function(){
      app.get('/:id', function(req, res){
        res.send('GET user ' + req.params.id);
      });
      
      app.del('/:id', function(req, res){
        res.send('DELETE user ' + req.params.id);
      });
    });
    
    app.get('/two', function(req, res){
      res.send('GET two');
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'GET user 12' });
  
    assert.response(app,
      { url: '/user/12', method: 'DELETE' },
      { body: 'DELETE user 12' });
    
    assert.response(app,
      { url: '/one' },
      { body: 'GET one' });
    
    assert.response(app,
      { url: '/two' },
      { body: 'GET two' });
  },
  
  'test app.namespace(str)': function(assert){
    var app = express.createServer();

    app.get('/one', function(req, res){
      res.send('GET one');
    });

    app.namespace('/user');

    app.get('/:id', function(req, res){
      res.send('GET user ' + req.params.id);
    });
    
    app.del('/:id', function(req, res){
      res.send('DELETE user ' + req.params.id);
    });

    app.namespace('/');
    
    app.get('/two', function(req, res){
      res.send('GET two');
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'GET user 12' });
  
    assert.response(app,
      { url: '/user/12', method: 'DELETE' },
      { body: 'DELETE user 12' });
    
    assert.response(app,
      { url: '/one' },
      { body: 'GET one' });
    
    assert.response(app,
      { url: '/two' },
      { body: 'GET two' });
  }
};