define([
	'jquery',
	'hbars!mods/item/item',
	'hasher'
],
function(
	$,
	template,
	hasher
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
			hasher.setHash(this.data.id);
		},
		render: function() {
			this.el.append(template(this.data));
		}
	};

	return ItemView;

});