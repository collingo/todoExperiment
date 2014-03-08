define([
	'underscore/objects/assign',
	'underscore/collections/where'
], function(
	_extend,
	_where
) {

	function Todo() {

	}
	Todo.prototype = _extend({}, {
		constructor: Todo
	});

	return Todo;

});