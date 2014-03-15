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

	function ItemView(data, isNew) {
		this.data = data;
		this.render.call(this);
		_bindAll(this,
			'bindEvents',
			'onToggle',
			'onChangeState',
			'onClick',
			'onAddResponse',
			'onDeleteResponse',
			'onDelete'
		);
		this.el[0].bindEvents = this.bindEvents.bind(this);
		return this.el;
	}
	ItemView.prototype = _extend({}, {
		constructor: ItemView,

		// events
		bindEvents: function() {
			this.el.find('.state').on('click', this.onToggle);
			this.el.find('.delete').on('click', this.onDelete);
			this.el.on('itemAddResponse', this.onAddResponse);
			this.el.on('deleteResponse', this.onDeleteResponse);
			events.on('changeState', this.onChangeState);
			this.bindChildNav();
		},
		unBindEvents: function() {
			this.el.find('.state').off('click', this.onToggle);
			this.el.find('.delete').off('click', this.onDelete);
			this.el.off();
			events.off('changeState', this.onChangeState);
		},
		bindChildNav: function() {
			if(!app.state || this.data.children.length) {
				this.el.on('click', this.onClick);
			} else {
				this.el.off('click', this.onClick);
			}
		},

		// handlers
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
		onDelete: function(e) {
			e.stopPropagation();
			this.deleteItem();
		},

		// comms
		onAddResponse: function(e, data) {
			if(data.status) {
				this.data = data.todo;
				this.el
					.removeClass('updating')
					.removeClass('error');
			} else {
				this.el.addClass('error');
			}
		},
		onDeleteResponse: function(e, data) {
			if(data.status) {
				this.unBindEvents();
				this.el.remove();
			} else {
				this.el
					.removeClass('deleting')
					.addClass('error');
			}
		},

		// methods
		render: function() {
			var viewdata = _extend({}, this.data, {
				childCount: this.data.children.length ? this.data.children.length : ""
			});
			this.el = dom(template(viewdata));
		},
		toggle: function() {
			this.data.done = this.data.done ? 0 : 1;
			this.el.find('input')[0].checked = !!this.data.done;
			this.el.trigger('itemStateChange', {
				id: this.data.id,
				change: {
					done: this.data.done ? 1 : 0
				},
				old: {
					done: this.data.done ? 0 : 1
				}
			});
		},
		deleteItem: function() {
			this.el.addClass('deleting');
			this.el.trigger('delete', {
				id: this.data.id
			});
		}
	});

	return ItemView;

});