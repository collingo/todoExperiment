define([
	'jquery',
	'hbars!mods/list/list',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'underscore/functions/bindAll',
	'mods/item/item',
	'events',
	'mods/app/app'
],
function(
	$,
	template,
	_forEach,
	_extend,
	_bindAll,
	ItemView,
	events,
	app
){

	function ListView(data) {
		_bindAll(this,
			'onAddResponse',
			'onDeleteResponse',
			'onItemChange',
			'onItemDelete',
			'onNewItem'
		);
		this.data = data;
		this.pendingSave = [];
		this.render.call(this);
		this.el[0].bindEvents = this.bindEvents.bind(this);
		if(!app.state && !this.data.children.length) {
			this.input.focus();
		}
		return this.el;
	}
	ListView.prototype = _extend({}, {
		constructor: ListView,

		// events
		bindEvents: function() {
			this.el.on('itemStateChange', '.item', this.onItemChange);
			this.el.on('delete', '.item', this.onItemDelete);
			this.el.on('listAddResponse', this.onAddResponse);
			this.el.on('itemDeleteResponse', this.onDeleteResponse);
			events.on('newItem', this.onNewItem);
		},
		onItemChange: function(e, data) {
			data.guid = app.guid();
			this.pendingSave[data.guid] = e.target;
			this.el.trigger('itemChange', data);
		},
		onItemDelete: function(e, data) {
			data.guid = app.guid();
			this.pendingSave[data.guid] = e.target;
			this.el.trigger('itemDelete', data);
		},

		// comms
		onAddResponse: function(e, data) {
			$(this.pendingSave[data.guid]).trigger('itemAddResponse', data);
			delete this.pendingSave[data.guid];
		},
		onDeleteResponse: function(e, data) {
			$(this.pendingSave[data.guid]).trigger('deleteResponse', data);
			delete this.pendingSave[data.guid];
		},
		onNewItem: function(text) {
			this.addNew(text);
		},

		// methods
		render: function() {
			var viewdata = _extend({}, this.data, {
				app: app
			});
			viewdata.hasParent = this.data.hasOwnProperty('parent');
			this.el = $(template(viewdata));
			this.renderChildren.call(this);
		},
		renderChildren: function() {
			_forEach(this.data.children, function(childData) {
				this.addChild(childData);
			}.bind(this));
		},
		addNew: function(text) {
			var guid = app.guid();
			var todo = {
				text: text,
				done: 0,
				children: [],
				parent: this.data.id
			};
			document.querySelector('input').value = '';
			this.el.trigger('newTodo', {
				todo: todo,
				guid: guid
			});
			this.addChild(todo, guid);
			this.el.addClass('children');
			events.fire('stitch');
		},
		addChild: function(todoData, guid) {
			var itemView = new ItemView(_extend({}, todoData));
			if(guid) {
				this.pendingSave[guid] = itemView;
				this.el.prepend(itemView);
			} else {
				this.el.append(itemView);
			}
		}
	});

	return ListView;

});