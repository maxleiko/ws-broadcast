var WebSocket = require('ws');
var assert = require('assert');

// start the server
var Server = require('../index.js');
var server = new Server(9001);

describe('Test ws-broadcast', function () {
	var c0, c1, c2;

	it('c0 should connect to the server', function (done) {
		c0 = new WebSocket('ws://localhost:9001');
		c0.on('open', function () {
			done();
		});
	});

	it('c1 should connect to the server', function (done) {
		c1 = new WebSocket('ws://localhost:9001');
		c1.on('open', function () {
			done();
		});
	});

	it('c2 should connect to the server', function (done) {
		c2 = new WebSocket('ws://localhost:9001');
		c2.on('open', function () {
			done();
		});
	});

	it('c0 should send a message to all others clients', function (done) {
		var msg = 'foo';
		var received = 0;

		function closeTest() {
			if (received === 2) {
				server.close();
				done();
			}
		}

		c0.on('message', function (message) {
			throw new Error('c0 is not supposed to get an echo of the message "'+message+'"');
		});

		c1.on('message', function (message) {
			assert.strictEqual(message, msg, 'c1 message');
			received++;
			closeTest();
		});
		c2.on('message', function (message) {
			assert.strictEqual(message, msg, 'c2 message');
			received++;
			closeTest();
		});

		c0.send(msg);
	});
});