define([
	'jquery',
	'hbars!mods/item/item',
	'mods/events/events'
],
function(
	$,
	template,
	events
){

	function ItemView(data) {
		this.data = data;
		this.el = $('<li class="item"></li>');
		this.render.call(this);
		this.el.on('click', this.onClick.bind(this));
		return this.el[0];
	}
	ItemView.prototype = {
		constructor: ItemView,
		onClick: function() {
			events.fire('go', this.data.id);
		},
		render: function() {
			this.el.append(template(this.data));
		}
	};

	return ItemView;

});