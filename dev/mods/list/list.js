define([
	'dom',
	'hbars!mods/list/list',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'baseView',
	'mods/item/item',
	'events'
],
function(
	dom,
	template,
	_forEach,
	_extend,
	BaseView,
	ItemView,
	events
){

	function ListView(data) {
		this.data = data;
		this.el = dom('<div class="listview"></div>');
		this.render.call(this);
		this.init.call(this);
		return this.el;
	}
	ListView.prototype = _extend({}, BaseView, {
		constructor: ListView,
		bindEvents: function() {
			this.el.find('.navButton').on('click', this.onNav.bind(this));
		    this.el.find('.toolbar').on('touchmove', function(e) {
				e.preventDefault();
			});
		},
		render: function() {
			var viewdata = _extend({}, this.data);
			if(this.data.hasOwnProperty('parent')) {
				viewdata.navButton = "Back";
			}
			this.el.html(template(viewdata));
			this.list = this.el.find('ul');
			this.renderChildren.call(this);
		},
		renderChildren: function() {
			_forEach(this.data.children, this.appendChild.bind(this));
		},
		appendChild: function(childData) {
			var item = new ItemView(_extend({}, childData));
			this.list.append(item);
		},
		onNav: function(e) {
			e.preventDefault();
			events.fire('go', this.data.parent.id);
		}
	});

	return ListView;

});