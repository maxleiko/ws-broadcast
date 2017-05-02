var debug = require('debug')('wsb-client-handler');
var WebSocket = require('ws');
var shortid = require('./shortid');

module.exports = function (wss, client) {
	client.id = shortid();

	client.on('message', function (msg) {
		var count = 0;
		// broadcast message to all connected clients in the room
		wss.clients.forEach(function (c) {
			if (c.upgradeReq.url === client.upgradeReq.url && c.id !== client.id) {
				if (c && c.readyState === WebSocket.OPEN) {
					count++;
					c.send(msg);
				}
			}
		});
		debug(' -> %s (%s receivers)', msg, count);
	});
}
