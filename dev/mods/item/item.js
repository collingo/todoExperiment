define([
	'dom',
	'hbars!mods/item/item',
	'events',
	'underscore/objects/assign',
	'baseView'
],
function(
	dom,
	template,
	events,
	_extend,
	BaseView
){

	function ItemView(data) {
		this.data = data;
		this.el = dom('<li class="item"></li>');
		this.render.call(this);
		this.init.call(this);
		return this.el;
	}
	ItemView.prototype = _extend({}, BaseView, {
		constructor: ItemView,
		bindEvents: function() {
			this.el.find('.state').on('click', this.onToggle.bind(this));
			this.el.on('click', this.onClick.bind(this));
		},
		onClick: function() {
			events.fire('go', this.data.id);
		},
		onToggle: function(e) {
			e.stopPropagation();
		},
		render: function() {
			var viewdata = _extend({}, this.data, {
				childCount: this.data.children.length ? this.data.children.length : ""
			});
			this.el.html(template(viewdata));
		},
		toggle: function() {
			this.data.done = !this.data.done;
			this.render();
		}
	});

	return ItemView;

});