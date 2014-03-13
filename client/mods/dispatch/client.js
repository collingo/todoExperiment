define([
	'jquery',
	'underscore/collections/forEach'
], function(
	$,
	_each
) {
	return function(view) {

		// append to window
		$('body')
			.empty()
			.append(view);

	};
});