define([
	'events'
], function(
	events
) {

	var app = {
		state: 1,
		guid: function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}
	};

	events.on('toggleState', function() {
		app.state = 1 - app.state;
		events.fire('changeState', app.state);
	});

	return app;

});