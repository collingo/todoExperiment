define([
	'jquery',
	'hbars!mods/item/item',
	'events',
	'underscore/objects/assign'
],
function(
	$,
	template,
	events,
	_extend
){

	function ItemView(data) {
		this.data = data;
		this.el = $('<li class="item"></li>');
		this.render.call(this);
		this.el.find('.state').on('click', this.onToggle.bind(this));
		this.el.on('click', this.onClick.bind(this));
		return this.el[0];
	}
	ItemView.prototype = {
		constructor: ItemView,
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
			this.el.append(template(viewdata));
		},
		toggle: function() {
			this.data.done = !this.data.done;
			this.render();
		}
	};

	return ItemView;

});