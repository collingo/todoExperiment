define([
	'jquery',
	'hbars!mods/list/list',
	'underscore/collections/forEach',
	'mods/item/item'
],
function(
	$,
	template,
	_forEach,
	ItemView
){

	function ListView(data) {
		this.data = data;
		this.el = $('<div></div>');
		this.render.call(this);
		if(this.data.children.length) {
			this.renderChildren.call(this);
		}
		return this.el[0];
	}
	ListView.prototype = {
		constructor: ListView,
		render: function() {
			this.el.append(template(this.data));
		},
		renderChildren: function() {
			_forEach(this.data.children, this.appendChild.bind(this));
		},
		appendChild: function(childData) {
			this.el.append(new ItemView(childData));
		}
	};

	return ListView;

});