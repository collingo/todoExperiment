define([
	'dom'
], function(
	$
) {
	return function(view) {
		// view.bindEvents();
		$('body')
			.empty()
			.append(view);
	};
});