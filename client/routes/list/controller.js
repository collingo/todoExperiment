define([
	'underscore/objects/cloneDeep',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'underscore/functions/bindAll',

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
			'onItemChange'
		);
	}
	Controller.prototype = {
		constructor: Controller,
		getHTML: function(element) {
			return element.els[0].outerHTML;
		},
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
			this.view = new ListView(this.buildViewObject(id));
			this.bindViewComms();
			return this.view;
		},
		bindViewComms: function() {
			$(this.view).on('newTodo', this.onNewTodo);
			$(this.view).on('itemChange', this.onItemChange);
		},
		addTodo: function(data) {
			storage.add(data, this.onAddResponse);
		},
		itemChange: function(data) {
			storage.update(data, this.itemChanged);
		},
		itemChanged: function(data) {
			$(this.view).trigger('itemState', data);
		},

		// comms
		onNewTodo: function(e, data) {
			this.addTodo(data);
		},
		onAddResponse: function(data) {
			this.view.trigger('listAddResponse', data);
		},
		onItemChange: function(e, data) {
			this.itemChange(data);
		}
	};

	var controller = new Controller();

	return {
		render: controller.render.bind(controller)
	}

});