define([
	'dom',
	'hbars!mods/list/list',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'envMixin',
	'mods/item/item',
	'events'
],
function(
	dom,
	template,
	_forEach,
	_extend,
	envMixin,
	ItemView,
	events
){

	function ListView(data) {
		this.data = data;
		this.render.call(this);
		return this.el;
	}
	ListView.prototype = _extend({}, {
		constructor: ListView,

		// events
		bindEvents: function() {
			this.el.find('.navButton').on('click', this.onNav.bind(this));
		    this.el.find('.toolbar').on('touchmove', this.onScrollToolbar.bind(this));
		},
		onNav: function(e) {
			e.preventDefault();
			events.fire('go', this.data.parent.id);
		},
		onScrollToolbar: function(e) {
			e.preventDefault();
		},

		// methods
		render: function() {
			var viewdata = _extend({}, this.data);
			viewdata.hasParent = this.data.hasOwnProperty('parent');
			this.el = dom(template(viewdata));
			this.list = this.el.find('ul');
			this.renderChildren.call(this);
		},
		renderChildren: function() {
			_forEach(this.data.children, this.appendChild.bind(this));
		},
		appendChild: function(childData) {
			var item = new ItemView(_extend({}, childData));
			this.list.append(item);
		}
	});

	envMixin(ListView);

	return ListView;

});