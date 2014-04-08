define([
	'underscore/objects/cloneDeep',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'underscore/functions/bindAll',

	'mods/toolbar/toolbar',
	'mods/list/list',
	'hbars!mods/list/list',
	'mods/storage/storage',
	'events',
	'jquery'
], function(
	_clone,
	_forEach,
	_extend,
	_bindAll,

	ToolbarView,
	ListView,
	template,
	storage,
	events,
	dom
) {

	function Controller() {
		_bindAll(this,
			'onNewTodo',
			'onAddResponse',
			'onItemChange',
			'onItemDelete',
			'itemDeleteResponse'
		);
	}
	Controller.prototype = {
		constructor: Controller,
		buildViewObject: function(id) {
			var obj = _clone(storage.get(id));
			if(obj.children.length) {
				var children = [];
				_forEach(obj.children, function(id) {
					var child = _clone(storage.get(id));
					children.push(_extend(child, {
						childCount: child.children.length
					}));
				});
				obj.children = children;
			}
			if(obj.parent) {
				var parentChildren = [];
				obj.parent = storage.get(obj.parent);
			}
			obj.hasParent = obj.hasOwnProperty('parent');
			return obj;
		},
		render: function(id) {
			this.toolbar = new ToolbarView(this.buildViewObject(id));
			this.content = new ListView(this.buildViewObject(id));
			this.bindViewComms();
			return {
				toolbar: this.toolbar,
				content: this.content
			};
		},
		bindViewComms: function() {
			$(this.content).on('newTodo', this.onNewTodo);
			$(this.content).on('itemChange', this.onItemChange);
			$(this.content).on('itemDelete', this.onItemDelete);
		},
		addTodo: function(data) {
			storage.add(data, this.onAddResponse);
		},
		itemChange: function(data) {
			storage.update(data, this.itemChanged);
		},
		itemChanged: function(data) {
			$(this.content).trigger('itemState', data);
		},
		itemDelete: function(data) {
			storage.del(data, this.itemDeleteResponse);
		},
		itemDeleteResponse: function(data) {
			$(this.content).trigger('itemDeleteResponse', data);
		},

		// comms
		onNewTodo: function(e, data) {
			this.addTodo(data);
		},
		onAddResponse: function(data) {
			this.content.trigger('listAddResponse', data);
		},
		onItemChange: function(e, data) {
			this.itemChange(data);
		},
		onItemDelete: function(e, data) {
			this.itemDelete(data);
		}
	};

	var controller = new Controller();

	return {
		render: controller.render.bind(controller)
	}

});