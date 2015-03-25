var WebSocket = require('ws');
var uuid = require('uuid');

var port = process.argv[2] || 9001;

var wss = new WebSocket.Server({ port: port });
var rooms = {};

wss.on('connection', function (ws) {
	ws.id = uuid();
	var room = rooms[ws.upgradeReq.url];
	if (!room) {
		room = {};
		rooms[ws.upgradeReq.url] = room;
	}
	room[ws.id] = ws;

	ws.on('message', function (msg) {
		var room = rooms[ws.upgradeReq.url];
		Object.keys(room).forEach(function (id) {
			if (id !== ws.id) {
				room[id].send(msg);
			}
		});
	});

	ws.on('close', function () {
		// free ws id
		delete rooms[ws.upgradeReq.url][ws.id];
		if (Object.keys(rooms[ws.upgradeReq.url]).length === 0) {
			// free the room if empty
			delete rooms[ws.upgradeReq.url];
		}
	})
});

setInterval(function () {
	Object.keys(rooms).forEach(function (id) {
		console.log(id, Object.keys(rooms[id]).length);
	});
}, 5000);

console.log('WebSocket broadcaster listening on 0.0.0.0:'+port);

module.exports = wss;