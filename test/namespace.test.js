
/**
 * Module dependencies.
 */

var express = require('express')
  , contrib = require('express-contrib');

module.exports = {
  'test app.namespace(str, fn)': function(assert){
    var app = express.createServer();

    app.get('/one', function(req, res){
      res.send('GET one');
    });

    assert.equal(app.namespace('/user', function(){}), app);

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
  
  'test app.namespace(str, fn) nesting': function(assert){
    var app = express.createServer();

    function middlewareOne(req, res, next) {
      req.middlewareOneVisited = true;
      next();
    }

    function middlewareTwo(req, res, next) {
      req.middlewareTwoVisited = true;
      next();
    }

    function middlewareThree(req, res, next) {
      req.middlewareThreeVisited = true;
      next();
    }

    app.get('/one', function(req, res){
      res.send('GET one');
    });

    app.namespace('/forum/:id', function(){
      app.get('/', function(req, res){
        res.send('GET forum ' + req.params.id);
      });
      
      app.get('/edit', function(req, res){
        res.send('GET forum ' + req.params.id + ' edit page');
      });

      app.namespace('/thread', function(){
        app.get('/:tid', middlewareOne, middlewareTwo, function(req, res){
          res.send('GET forum ' + req.params.id + ' thread ' + req.params.tid +
            ' with middleware 1 ' + String(req.middlewareOneVisited) +
            ' and middleware 2 ' + String(req.middlewareTwoVisited)
            );
        });
      });

      app.del('/', function(req, res){
        res.send('DELETE forum ' + req.params.id);
      });
      
      app.get('/middle', middlewareThree, function(req, res) {
        res.send('GET forum ' + req.params.id +
          ' with middleware ' + String(req.middlewareThreeVisited));
      });
    });
    
    app.get('/two', function(req, res){
      res.send('GET two');
    });
    
    assert.response(app,
      { url: '/forum/1' },
      { body: 'GET forum 1' });
    
    assert.response(app,
      { url: '/forum/1/edit' },
      { body: 'GET forum 1 edit page' });
    
    assert.response(app,
      { url: '/forum/1/thread/50' },
      { body: 'GET forum 1 thread 50 with middleware 1 true and middleware 2 true' });
  
    assert.response(app,
      { url: '/forum/2', method: 'DELETE' },
      { body: 'DELETE forum 2' });
    
    assert.response(app,
      { url: '/forum/2/middle' },
      { body: 'GET forum 2 with middleware true' });

    assert.response(app,
      { url: '/one' },
      { body: 'GET one' });
    
    assert.response(app,
      { url: '/two' },
      { body: 'GET two' });
  },
  
  'test fn.route': function(assert){
    var app = express.createServer();

    app.namespace('/user/:id', function(){
      app.get('/', function handler(req, res){
        assert.equal('/user/:id', handler.namespace);
        res.send(200);
      });
    });

    assert.response(app,
      { url: '/user/12' },
      { body: 'OK' });
  }
};