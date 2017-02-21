const React = require('react');

const Rooms = React.createClass({

	getInitialState: function () {
		return {
			connections: 0,
			rooms: {}
		};
	},

	componentDidMount: function () {
		var self = this;
		var uri = window.location.href.replace('http', 'ws');
		if (!uri.endsWith('/')) {
			uri = uri + '/';
		}
		this.client = new WebSocket(uri + '.__room_watcher__');

		this.client.onmessage = function (event) {
			self.setState(JSON.parse(event.data));
		};
	},

	componentWillUnmount: function () {
		if (this.client) {
			this.client.close();
		}
	},

	render: function () {
		var state = this.state;
		var keys = Object.keys(this.state.rooms);

		var content = null;
		if (keys.length === 0) {
			content = (
				<div className="list-group-item">
					<em>No client connected currently</em>
				</div>
			);
		} else {
			content = (
				<div>
					{keys.map(function(name) {
						return (
							<li key={name} className="list-group-item">
								<span>{name}</span>
								<span className="badge">{state.rooms[name]}</span>
							</li>
						);
					})}
				</div>
			);
		}

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<span>Rooms</span>
					<em className="pull-right">Connections: {state.connections} / Rooms count: {keys.length} </em>
				</div>
				<div className="list-group">{content}</div>
			</div>
		);
	}
});

module.exports = Rooms;
