var WebSocket = require('ws');
var uuid = require('uuid');

var wss = new WebSocket.Server({ port: 9001 });
wss.on('connection', function (ws) {
	ws.id = uuid();
	ws.on('message', function (msg) {
		wss.clients.forEach(function (client) {
			if (client.id !== ws.id) {
				client.send(msg);
			}
		});
	});
});
console.log('WebSocket broadcaster listenning on 0.0.0.0:9001');

module.exports = wss;