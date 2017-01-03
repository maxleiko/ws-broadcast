#!/usr/bin/env node

var express = require('express');
var WebSocket = require('ws');
var http = require('http');
var path = require('path');

var wsClientHandler = require('../lib/wsClientHandler');

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

var ROOM_WATCHER_URI = '/.__room_watcher__';
var wss = new WebSocket.Server({ server: server });
function sendStatusToWebClient() {
  var data = wss.clients.filter(function (client) {
    // filter UI clients
    return client.upgradeReq.url !== ROOM_WATCHER_URI;
  }).reduce(function (prev, curr) {
    // process data
    var count = prev[curr.upgradeReq.url] || 0;
    prev[curr.upgradeReq.url] = count + 1;
    return prev;
  }, {});

  var dataStr = JSON.stringify(data);
  wss.clients.filter(function (client) {
    return client.upgradeReq.url === ROOM_WATCHER_URI;
  }).forEach(function (client) {
    client.send(dataStr);
  });
}
wss.on('connection', function (client) {
  if (client.upgradeReq.url !== ROOM_WATCHER_URI) {
    wsClientHandler(wss, client, sendStatusToWebClient);
  } else {
		sendStatusToWebClient();
	}
});

server.listen(app.get('port'), function() {
  console.log('WSBroadcast server listening at 0.0.0.0:' + app.get('port'));
});
