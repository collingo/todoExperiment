define([
	'events'
], function(
	events
) {

	var app = {
		state: 1
	};

	events.on('toggleState', function() {
		app.state = 1 - app.state;
		events.fire('changeState', app.state);
	});

	return app;

});