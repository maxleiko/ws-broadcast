var ws = require('ws');
var uuid = require('uuid');
var events = require('events');

function WSServer(serverOrPort) {
  var self = this;
  if (typeof serverOrPort === 'number') {
    this.wss = new ws.Server({
      port: serverOrPort
    }, function() {});
  } else {
    this.wss = new ws.Server({
      server: serverOrPort
    });
  }
  this.rooms = {};
  this.emitter = new events.EventEmitter();

  this.wss.on('connection', function(ws) {
    ws.id = uuid();
    var room = self.rooms[ws.upgradeReq.url];
    if (!room) {
      room = {};
      self.rooms[ws.upgradeReq.url] = room;
    }
    room[ws.id] = ws;

    self.emitter.emit('update');

    function freeRoom() {
      // free ws id
      delete room[ws.id];
      if (Object.keys(room).length === 0) {
        // free the room if empty
        delete self.rooms[ws.upgradeReq.url];
      }
      self.emitter.emit('update');
    }

    ws.on('message', function(msg) {
      Object.keys(room).forEach(function(id) {
        if (id !== ws.id) {
          room[id].send(msg);
        }
      });
    });

    ws.on('close', freeRoom);
    ws.on('error', freeRoom);
  });
}

WSServer.prototype.close = function() {
  this.wss.close();
};

WSServer.prototype.on = function (event, handler) {
  this.emitter.on(event, handler);
};

module.exports = WSServer;
