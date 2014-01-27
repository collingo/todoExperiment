define([
	'dom',
	'hbars!mods/list/list',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'mods/item/item',
	'events'
],
function(
	dom,
	template,
	_forEach,
	_extend,
	ItemView,
	events
){

	function ListView(data) {
		this.data = data;
		this.el = dom('<div class="listview"></div>');
		this.render.call(this);
		this.list = this.el.find('ul');
		if(this.data.children.length) {
			this.renderChildren.call(this);
		}
		this.el.find('.navButton').on('click', this.onNav.bind(this));

		return this.el;
	}
	ListView.prototype = {
		constructor: ListView,
		render: function() {
			var viewdata = _extend({}, this.data, {
				navButton: "Back",
				contextButton: "Edit"
			});
			this.el.html(template(viewdata));
		},
		renderChildren: function() {
			_forEach(this.data.children, this.appendChild.bind(this));
		},
		appendChild: function(childData) {
			console.log("freagrea");
			var item = new ItemView(_extend({}, childData));
			this.list.append(item);
		},
		onNav: function(e) {
			e.preventDefault();
			events.fire('go', this.data.parent.id);
		}
	};

	return ListView;

});