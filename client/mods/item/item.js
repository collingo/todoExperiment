define([
	'dom',
	'hbars!mods/item/item',
	'events',
	'underscore/objects/assign'
],
function(
	dom,
	template,
	events,
	_extend
){

	function ItemView(data) {
		this.data = data;
		this.render.call(this);
		this.el.els[0].bindEvents = this.bindEvents.bind(this);
		return this.el;
	}
	ItemView.prototype = _extend({}, {
		constructor: ItemView,

		// events
		bindEvents: function() {
			this.el.find('.state').on('click', this.onToggle.bind(this));
			this.el.on('click', this.onClick.bind(this));
		},
		onClick: function() {
			events.fire('go', this.data.id);
		},
		onToggle: function(e) {
			e.stopPropagation();
			this.toggle();
		},

		// methods
		render: function() {
			var viewdata = _extend({}, this.data, {
				childCount: this.data.children.length ? this.data.children.length : ""
			});
			this.el = dom(template(viewdata));
		},
		toggle: function() {
			this.data.done = !this.data.done;
			if(this.data.done) {
				this.el.find('input').els[0].checked = true;
				data[this.data.id].done = true;
			} else {
				this.el.find('input').els[0].checked = false;
				data[this.data.id].done = false;
			}
		}
	});

	return ItemView;

});