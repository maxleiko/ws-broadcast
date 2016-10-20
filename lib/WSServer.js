var WebSocket = require('ws');
var events = require('events');

function WSServer(serverOrPort) {
  var self = this;
  if (typeof serverOrPort === 'number') {
    this.wss = new WebSocket.Server({
      port: serverOrPort
    }, function() {});
  } else {
    this.wss = new WebSocket.Server({
      server: serverOrPort
    });
  }
  console.log('WebSocket gateway listening at 0.0.0.0:' + this.wss.options.port);
  this.emitter = new events.EventEmitter();

  this.wss.on('connection', function (client) {
    var heartbeat;
    self.emitter.emit('update');

    client.on('message', function (msg) {
      // broadcast message to all connected clients in the room
      self.wss.clients.forEach(function (c) {
        if (c.upgradeReq.url === client.upgradeReq.url && c.id !== client.id) {
          c.send(msg);
        }
      });
    });

    client.on('close', function () {
      clearTimeout(heartbeat);
      self.emitter.emit('update');
    });
    client.on('error', function () {
      clearTimeout(heartbeat);
      self.emitter.emit('update');
    });

    function verifyConn() {
      if (client && client.readyState === WebSocket.OPEN) {
        return setTimeout(verifyConn, 5000);
      }
    }
    heartbeat = verifyConn();
  });
}

WSServer.prototype.close = function() {
  if (this.wss) {
    this.wss.clients.forEach(function (client) {
      if (client) {
        client.close();
      }
    });
    this.wss.close();
  }
};

WSServer.prototype.on = function (event, handler) {
  this.emitter.on(event, handler);
};

module.exports = WSServer;
