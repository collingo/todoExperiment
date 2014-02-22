define([
	'underscore/objects/assign',
	'underscore/collections/forEach',
	'underscore/collections/where',
	'dom',
	'libs/fastclick/lib/fastclick',

	'router',
	'events'
], function(
	_extend,
	_forEach,
	_where,
	$,
	FastClick,

	router,
	events
) {

	FastClick.attach(document.body);

	router.init(window.initId);

});