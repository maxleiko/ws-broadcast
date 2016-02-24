#!/usr/bin/env node

var express = require('express');
var ws = require('ws');
var WSServer = require('../lib/WSServer');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var wss = new WSServer(server);

var serveStatic = require('serve-static');
var morgan = require('morgan');
var errorHandler = require('errorhandler');

// all environments
app.set('port', process.argv[2] || 3000);
app.use(morgan('dev'));
app.use(serveStatic(path.join(__dirname, '..', 'public')));

// development only
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

var realTimeServer = new ws.Server({ port: 3001 });
realTimeServer.on('connection', function (client) {
  client.send(getJSONRooms());
});
wss.on('update', function () {
  realTimeServer.clients.forEach(function (client) {
    if (client && client.readyState === ws.OPEN) {
      client.send(getJSONRooms());
    }
  });
});

server.listen(app.get('port'), function() {
  console.log('WSBroadcast server listening on port ' + app.get('port'));
});

function getJSONRooms() {
  var data = [];
  for (var roomName in wss.rooms) {
    data.push({ name: roomName, clients: Object.keys(wss.rooms[roomName]).length });
  }
  return JSON.stringify(data);
}
