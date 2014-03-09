define([
	'signals'
], function(
	signals
) {

	var events = {
		go : new signals.Signal(),
		stitch : new signals.Signal(),
		toggleState : new signals.Signal(),
		changeState : new signals.Signal()
	};

	return {
		fire: function(event) {
			if(events[event]) {
				events[event].dispatch.apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				console.error("Event "+event+" does not exist");
			}
		},
		on: function(event, cb) {
			if(events[event]) {
				events[event].add(cb);
			} else {
				console.error("Event "+event+" does not exist");
			}
		}
	};

});