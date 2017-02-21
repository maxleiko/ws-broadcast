var WebSocket = require('ws');
var shortid = require('./shortid');

/**
 * WebSocket client decorator that will periodically check for ping answers
 * If the client becomes unresponsive, then it will close the connection.
 */
function ConnectionChecker(client) {
	this.client = client;
	this.started = false;
	this.heartbeat = null;
	this.ping = null;

	var self = this;
	this.client.on('pong', function (msg) {
		if (msg && msg.length > 0) {
			if (msg === self.pingId) {
				// client is responsive :) => restart checker
				console.log('"%s" received pong answer to ping "%s"', self.client.id, self.pingId); // eslint-disable-line
				self.start();
			}
		} else {
			// pong message is empty or null: stop
			self.stop();
		}
	});
}

ConnectionChecker.prototype.start = function () {
	var self = this;
	self.started = true;
	setTimeout(function () {
		if (self.client && self.client.readyState === WebSocket.OPEN) {
			// client is opened
			self.pingId = shortid();
			console.log('Sending ping "%s" to "%s"', self.pingId, self.client.id); // eslint-disable-line
			self.client.ping(self.pingId, null, false);
			self.ping = setTimeout(function () {
				// if we end-up here it means that the client took too long
				// to answer the ping request
				self.stop();
			}, 5000);

		} else {
			// client is not opened: stop checking
			self.stop();
		}
	}, 10000);
};

ConnectionChecker.prototype.stop = function () {
	if (this.started) {
		clearTimeout(this.heartbeat);
		clearTimeout(this.ping);
		this.client.close(4042, 'client seems unresponsive');
		console.log('"%s" seems unresponsive: closing...', this.client.id); // eslint-disable-line
		this.started = false;
	}
};

module.exports = ConnectionChecker;
