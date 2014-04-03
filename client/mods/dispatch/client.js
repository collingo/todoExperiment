define([
	'jquery',
	'underscore/collections/forEach'
], function(
	$,
	_each
) {
	return function(views) {

		// append to regions
		$('.toolbarRegion')
			.empty()
			.append(views.toolbar);
		$('.content')
			.empty()
			.append(views.content);

	};
});