define([
	'dom',
	'underscore/collections/forEach'
], function(
	$,
	_each
) {
	return function(view) {

		return view.els[0].outerHTML;
		
	};
});