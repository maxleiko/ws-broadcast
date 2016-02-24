/*
 * This is the source file used to generate the bundle.js client
 */
var React = require('react');
var ReactDOM = require('react-dom');

var Rooms = React.createClass({
  getInitialState: function () {
    return { rooms: [] }
  },

  componentDidMount: function () {
    this.client = new WebSocket('ws://localhost:3001');
    this.client.addEventListener('message', function (event) {
      var rooms = JSON.parse(event.data);
      this.setState({ rooms: rooms });
    }.bind(this));
  },

  componentWillUnmount: function () {
    this.client.close();
  },

  render: function() {
    var emptyRooms;
    if (this.state.rooms.length === 0) {
      emptyRooms = (
        <div className="list-group-item">
          <em>No client connected currently</em>
        </div>
      );
    }

    return (
			<div className="panel panel-default">
				<div className="panel-heading">Rooms</div>
				<div className="list-group">
				{emptyRooms}
				{this.state.rooms.map(function (item) {
					return (
						<li className="list-group-item" key={item.name}>
							<span>{item.name}</span>
							<span className="badge">{item.clients}</span>
						</li>
					);
				})}
				</div>
			</div>
    );
  }
});

ReactDOM.render(
	<Rooms />,
	document.getElementById('container')
);
