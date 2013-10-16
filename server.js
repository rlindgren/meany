// fire up server and connect socket
var app = require('express')()
  , passport = require('passport')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , config = require('./config')
  , serverBootstrap = require(config.paths.server.bootstrap);

// bootstrap app via config pipeline
serverBootstrap(app, passport, io, config);

// start listening on designated port
port = process.env.PORT || 3000;
server.listen(port);
console.log(config.name + ' started in "' + config.env + '" mode on port ' + port);

// expose app
module.exports = app;