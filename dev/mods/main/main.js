define([
	'underscore/objects/assign',
	'underscore/collections/forEach',
	'underscore/collections/where',
	'dom',

	'router',
	'events'
], function(
	_extend,
	_forEach,
	_where,
	$,

	router,
	events
) {

	// prevent scroll on toolbar
	document.body.addEventListener('touchmove', function(e) {
		if ($(e.target).parent('.toolbar').length) {
			e.preventDefault();
		}
    }, false);

	events.fire('go', 0);

});