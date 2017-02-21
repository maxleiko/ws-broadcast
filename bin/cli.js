#!/usr/bin/env node

var WebSocket = require('ws');
var wsClientHandler = require('../lib/wsClientHandler');

var PORT = process.argv[2] || process.env.WS_PORT || process.env.PORT || 9000;
var wss = new WebSocket.Server({ port: PORT });
wss.on('connection', function (client) {
  wsClientHandler(wss, client);
});
