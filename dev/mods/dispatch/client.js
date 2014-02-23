define([
	'dom',
	'underscore/collections/forEach'
], function(
	$,
	_each
) {
	return function(view) {

		// loop over dom in view to bind events
		view.els[0].bindEvents();
		_each(view.find('.item').els, function(item) {
			item.bindEvents();
		});

		// append to window
		$('body')
			.empty()
			.append(view);
	};
});