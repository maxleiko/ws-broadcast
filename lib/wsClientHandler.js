var WebSocket = require('ws');
var shortid = require('./shortid');

var noop = function () {};

module.exports = function (wss, client, updateHandler) {
	updateHandler = updateHandler || noop;
	var heartbeat;
	client.id = shortid();
	updateHandler();

	client.on('message', function (msg) {
		// broadcast message to all connected clients in the room
		wss.clients.forEach(function (c) {
			if (c.upgradeReq.url === client.upgradeReq.url && c.id !== client.id) {
				c.send(msg);
			}
		});
	});

	client.on('close', function () {
		clearTimeout(heartbeat);
		updateHandler();
	});
	client.on('error', function () {
		clearTimeout(heartbeat);
		updateHandler();
	});

	function verifyConn() {
		if (client && client.readyState === WebSocket.OPEN) {
			return setTimeout(verifyConn, 5000);
		}
	}
	heartbeat = verifyConn();
}
