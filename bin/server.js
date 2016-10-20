#!/usr/bin/env node

var express = require('express');
var ws = require('ws');
var http = require('http');
var path = require('path');

var WSServer = require('../lib/WSServer');

var app = express();
var server = http.createServer(app);

var serveStatic = require('serve-static');
var errorHandler = require('errorhandler');

// all environments
app.set('port', process.env.PORT || 3000);
app.use(serveStatic(path.join(__dirname, '..', 'public')));
app.all('*', function (req, res) {
  res.redirect('/');
});

// development only
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

var wss = new WSServer(parseInt(process.env.WS_PORT, 10) || 9000);
var realTimeServer = new ws.Server({ server: server });
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
  console.log('HTTP server listening at 0.0.0.0:' + app.get('port'));
});

function getJSONRooms() {
  var data = wss.wss.clients.reduce(function (prev, curr) {
    var count = prev[curr.upgradeReq.url] || 0;
    prev[curr.upgradeReq.url] = count + 1;
    return prev;
  }, {});
  return JSON.stringify(data);
}
