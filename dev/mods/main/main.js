define([
	'underscore/objects/assign',
	'underscore/collections/forEach',
	'underscore/collections/where',
	'jquery',

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

	// $('html').on('.toolbar', 'touchstart', function(e) {
	// 	e.preventDefault();
	// 	e.stopPropagation();
	// 	return false;
	// });

	document.body.addEventListener('touchmove', function(e) {
		if ($(e.target).parent('.toolbar').length) {
			e.preventDefault();
		}
    }, false);

	events.fire('go', 0);

});