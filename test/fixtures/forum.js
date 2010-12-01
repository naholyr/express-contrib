
exports.index = function(req, res){
  res.send('forum index');
};

exports.new = function(req, res){
  res.send('new forum');
};

exports.create = function(req, res){
  res.send('create forum ' + req.body.name);
};

exports.show = function(req, res){
  res.send('show forum ' + this.id);
};

exports.edit = function(req, res){
  res.send('edit forum ' + this.id);
};

exports.update = function(req, res){
  res.send('update forum ' + this.id + ' with ' + req.body.name);
};

exports.destroy = function(req, res){
  res.send('destroy forum ' + this.id);
};