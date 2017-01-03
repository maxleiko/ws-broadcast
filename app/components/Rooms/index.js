var React = require('react');

const Rooms = React.createClass({

  getInitialState: function() {
    return { rooms: [] };
  },

  componentDidMount: function() {
		var self = this;
    var uri = window.location.href.replace('http', 'ws');
    if (!uri.endsWith('/')) {
      uri = uri + '/';
    }
    this.client = new WebSocket(uri + '.__room_watcher__');

    this.client.onmessage = function (event) {
      var rooms = JSON.parse(event.data);
      self.setState({ rooms: rooms });
    };
  },

  componentWillUnmount: function() {
    if (this.client) {
      this.client.close();
    }
  },

  render: function () {
    var keys = Object.keys(this.state.rooms);

    if (keys.length === 0) {
      return (
        <div className="list-group-item">
          <em>No client connected currently</em>
        </div>
      );
    }

    return (
      <div>
        {keys.map(function (name) {
          return (
            <li key={name} className="list-group-item">
              <span>{name}</span>
              <span className="badge">{this.state.rooms[name]}</span>
            </li>
          );
        }.bind(this))}
      </div>
    );
  }
});

module.exports = Rooms;
