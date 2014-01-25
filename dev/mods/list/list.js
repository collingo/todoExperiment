define([
	'jquery',
	'hbars!mods/list/list',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'mods/item/item',
	'events'
],
function(
	$,
	template,
	_forEach,
	_extend,
	ItemView,
	events
){

	function ListView(data) {
		this.data = data;
		this.el = $('<div class="listview"></div>');
		this.render.call(this);
		this.list = this.el.find('ul');
		if(this.data.children.length) {
			this.renderChildren.call(this);
		}
		this.el.find('.navButton').on('click', this.onNav.bind(this));

		return this.el[0];
	}
	ListView.prototype = {
		constructor: ListView,
		render: function() {
			var viewdata = _extend({}, this.data, {
				navButton: "Back",
				contextButton: "Edit"
			});
			this.el.append(template(viewdata));
		},
		renderChildren: function() {
			_forEach(this.data.children, this.appendChild.bind(this));
		},
		appendChild: function(childData) {
			this.list.append(new ItemView(_extend({}, childData)));
		},
		onNav: function(e) {
			e.preventDefault();
			events.fire('go', this.data.parent.id);
		}
	};

	return ListView;

});