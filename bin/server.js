#!/usr/bin/env node

var express = require('express');
var WebSocket = require('ws');
var http = require('http');
var path = require('path');

var wsClientHandler = require('../lib/wsClientHandler');

var ROOM_WATCHER_URI = '/.__room_watcher__';

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

var wss = new WebSocket.Server({ server: server });

var wsState = {
	connections: 0,
	rooms: {}
};

function sendStatusToWebClient() {
	var dataStr = JSON.stringify(wsState);
	wss.clients.filter(function (client) {
		return client.upgradeReq.url === ROOM_WATCHER_URI;
	}).forEach(function (client) {
		client.send(dataStr);
	});
}

wss.on('connection', function (client) {
	if (client.upgradeReq.url !== ROOM_WATCHER_URI) {
		// WebSocket broadcaster client
		// console.log(' + %s', client.upgradeReq.url);
		wsState.connections = wsState.connections + 1;
		wsState.rooms[client.upgradeReq.url] = wsState.rooms[client.upgradeReq.url] || 0;
		wsState.rooms[client.upgradeReq.url] = wsState.rooms[client.upgradeReq.url] + 1;

		client.on('close', function () {
			// console.log(' - %s', client.upgradeReq.url);
			wsState.connections = wsState.connections - 1;
			wsState.rooms[client.upgradeReq.url] = wsState.rooms[client.upgradeReq.url] - 1;
			if (wsState.rooms[client.upgradeReq.url] === 0) {
				delete wsState.rooms[client.upgradeReq.url];
			}
			sendStatusToWebClient();
		});

		wsClientHandler(wss, client, sendStatusToWebClient);

	}
	sendStatusToWebClient();
});

server.listen(app.get('port'), function () {
	console.log('WSBroadcast server listening at 0.0.0.0:' + app.get('port'));
});
