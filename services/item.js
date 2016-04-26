var Item = require('../models/item');

var save = function(name, callback, errback) {
    Item.create({name: name},function(err, item) {
        if(err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

var list = function(callback, errback) {
  Item.find(function(err, items) {
      if(err) {
          errback(err);
          return;
      }
      callback(items);
  });
};

var update = function(id, name, callback, errback) {
    Item.findOneAndUpdate({_id: id}, {name: name}, {new: true}, function(err, item) {
        
        if(err) {
            save(name, callback, errback);
            return;
        }

        callback(item);
    });
};

var del = function(id, callback, errback) {
    Item.findOneAndRemove({_id: id}, function(err, item) {
        if(err|| !item) {
            errback(err);
            return;
        }
        callback(item);
    });
};

module.exports.save = save;
module.exports.list = list;
module.exports.update = update;
module.exports.delete = del;