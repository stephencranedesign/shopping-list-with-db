var mongoose = require('mongoose');
var env = require('../enviornment');
var config = require('./config');

mongoose.connect(config[env].url);