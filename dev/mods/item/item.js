define([
	'jquery',
	'hbars!mods/item/item'
],
function(
	$,
	template
){

	function ItemView(data) {
		this.data = data;
		this.el = $('<li></li>');
		this.render.call(this);
		return this.el[0];
	}
	ItemView.prototype = {
		constructor: ItemView,
		render: function() {
			this.el.append(template(this.data));
		}
	};

	return ItemView;

});