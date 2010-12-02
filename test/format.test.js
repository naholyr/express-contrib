
/**
 * Module dependencies.
 */

var express = require('express')
  , contrib = require('express-contrib');

module.exports = {
  'test .format() extensions': function(assert){
    var app = express.createServer();

    app.get('/user/:id', function(req, res){
      var user = { name: { first: 'tj', last: 'holowaychuk' }};
      
      // json
      res.format('.json', function(){
        res.send(user);
      });

      // html
      res.format('.html', function(){
        res.send('<h1>' + user.name.first + ' ' + user.name.last + '</h1>');
      });
      
      // xml
      res.format('.xml', function(){
        console.log(res.headers);
        res.writeHead(200, res.headers);
        res.write('<user>');
        res.write('  <first>' + user.name.first + '</first>');
        res.write('  <last>' + user.name.last + '</last>');
        res.write('</user>');
        res.end();
      });

      // default
      res.format(function(){
        res.header('Content-Type', 'text/plain');
        res.send(user.name.first + ' ' + user.name.last);
      });
    });

    assert.response(app,
      { url: '/user/1.xml' },
      { body: 'asdf'
      , headers: { 'Content-Type': 'application/xml' }});

    assert.response(app,
      { url: '/user/1.json' },
      { body: '{"name":{"first":"tj","last":"holowaychuk"}}'
      , headers: { 'Content-Type': 'application/json' } });
    
    assert.response(app,
      { url: '/user/1.html' },
      { body: '<h1>tj holowaychuk</h1>'
      , headers: { 'Content-Type': 'text/html' } });

    assert.response(app,
      { url: '/user/1.foo' },
      { body: 'tj holowaychuk'
      , headers: { 'Content-Type': 'text/plain' } });
  },
  
  'test .format() args': function(assert){
    var app = express.createServer();

    app.get('/forum/:fid', function(req, res){
      var forum = { title: 'Movies' };
      
      res.format('.xml', function(obj, fn){
        fn('<title>' + forum.title + '</title>');
      });

      res.format('.html', function(){
        this.writeHead(200, this.headers);
        this.write('<h1>Forum');
        this.write(' ' + forum.title);
        this.write('</h1>');
        this.end();
      });

      assert.response(app,
        { url: '/forum/12.html' },
        { body: '<h1>Forum Movies</h1>'
        , headers: { 'Content-Type': 'text/html' }});

      assert.response(app,
        { url: '/forum/12.xml' },
        { body: '<title>Movies</title>'
        , headers: { 'Content-Type': 'application/xml' }});
    });
  },
  
  'test .format() Accept': function(assert){
    var app = express.createServer();

    app.get('/user/:id', function(req, res){
      var user = { name: { first: 'tj', last: 'holowaychuk' }};
      
      // json
      res.format('.json', function(){
        res.send(user);
      });

      // html
      res.format('.html', function(){
        res.send('<h1>' + user.name.first + ' ' + user.name.last + '</h1>');
      });
    });

    assert.response(app,
      { url: '/user/1', headers: { Accept: 'application/json' } },
      { body: '{"name":{"first":"tj","last":"holowaychuk"}}'
      , headers: { 'Content-Type': 'application/json' } });
    
    assert.response(app,
      { url: '/user/1', headers: { Accept: 'text/html' }},
      { body: '<h1>tj holowaychuk</h1>'
      , headers: { 'Content-Type': 'text/html' } });

    // Our default is .json in this case,
    // because Accept is not set
    assert.response(app,
      { url: '/user/1' },
      { body: '{"name":{"first":"tj","last":"holowaychuk"}}' });
  },
  
  'test .format() automatic': function(assert){
    var app = express.createServer();

    app.format('.html', function(obj, fn){
      fn(null, '<h1>' + obj.name.first + ' ' + obj.name.last + '</h1>');
    });

    app.get('/user/:id', function(req, res){
      var user = { name: { first: 'tj', last: 'holowaychuk' }};
      res.format('.json', user);
      res.format('.html', user);
    });

    assert.response(app,
      { url: '/user/1' },
      { body: '{"name":{"first":"tj","last":"holowaychuk"}}'
      , headers: { 'Content-Type': 'application/json' } });
    
    assert.response(app,
      { url: '/user/1.html' },
      { body: '<h1>tj holowaychuk</h1>'
      , headers: { 'Content-Type': 'text/html' } });
  }
}