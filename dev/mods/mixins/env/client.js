define([
	'underscore/objects/assign'
], function(
	_extend
){

	var mixin = {
		postRender: function() {
			this.bindEvents.call(this);
		}
	};

	return function applyMixin(View) {
		_extend(View.prototype, mixin);

		var cachedRender = View.prototype.render;
		View.prototype.render = function() {
			cachedRender.apply(this, arguments);
			this.postRender.apply(this, arguments);
		};
	};

});