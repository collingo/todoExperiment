define([
	'jquery',
	'hbars!mods/item/item',
	'events',
	'underscore/objects/assign',
	'underscore/functions/bindAll',
	'mods/app/app'
],
function(
	dom,
	template,
	events,
	_extend,
	_bindAll,
	app
){

	function ItemView(data) {
		this.data = data;
		this.render.call(this);
		_bindAll(this, 'bindEvents', 'onToggle', 'onChangeState', 'onClick');
		this.el[0].bindEvents = this.bindEvents.bind(this);
		return this.el;
	}
	ItemView.prototype = _extend({}, {
		constructor: ItemView,

		// events
		bindEvents: function() {
			this.el.find('.state').on('click', this.onToggle);
			events.on('changeState', this.onChangeState);
			this.bindChildNav();
		},
		bindChildNav: function() {
			if(!app.state || this.data.children.length) {
				this.el.on('click', this.onClick);
			} else {
				this.el.off('click', this.onClick);
			}
		},
		onChangeState: function() {
			this.bindChildNav();
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