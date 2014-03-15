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
			'onNav',
			'onToggleState',
			'onScrollToolbar',
			'onInputBlur',
			'onKeyPress',
			'onKeyUp',
			'onChangeState',
			'onAddResponse',
			'onItemChange'
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
			this.el.find('.navButton').on('click', this.onNav);
			this.el.find('.thinkDoToggle').on('click', this.onToggleState);
			this.el.find('.toolbar').on('touchmove', this.onScrollToolbar);
			this.el.on('change', '.item', this.onItemChange);
			this.input.on('blur', this.onInputBlur);
			this.input.on('keypress', this.onKeyPress);
			this.input.on('keyup', this.onKeyUp);
			events.on('changeState', this.onChangeState);
			this.el.on('listAddResponse', this.onAddResponse);
		},
		onNav: function(e) {
			e.preventDefault();
			events.fire('go', this.data.parent.id);
		},
		onToggleState: function(e) {
			e.preventDefault();
			events.fire('toggleState');
		},
		onChangeState: function(state) {
			this.toggleState(state);
		},
		onScrollToolbar: function(e) {
			e.preventDefault();
		},
		onInputBlur: function(e) {
			this.input.val('');
		},
		onKeyUp: function(e) {
			e.preventDefault();
			switch(e.keyCode) {
			case 13:
				this.addNew(this.input.val());
				break;
			case 27:
				e.preventDefault();
				this.input.blur();
				break;
			}
		},
		onKeyPress: function(e) {
			if(!this.input.val().length && e.keyCode > 94 && e.keyCode < 123) {
				e.preventDefault();
				this.input.val(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'][e.keyCode - 97]);
			}
		},
		onItemChange: function(e, data) {
			data.guid = this.guid();
			this.pendingSave[data.guid] = e.target;
			this.el.trigger('itemChange', data);
		},

		// comms
		onAddResponse: function(e, data) {
			this.pendingSave[data.guid].trigger('itemAddResponse', data);
			delete this.pendingSave[data.guid];
		},

		// methods
		render: function() {
			var viewdata = _extend({}, this.data, {
				app: app
			});
			viewdata.hasParent = this.data.hasOwnProperty('parent');
			this.el = $(template(viewdata));
			this.list = this.el.find('ul');
			this.input = this.el.find('input');
			this.renderChildren.call(this);
		},
		renderChildren: function() {
			_forEach(this.data.children, function(childData) {
				this.addChild(childData);
			}.bind(this));
		},
		guid: function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		},
		addNew: function(text) {
			var guid = this.guid();
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
				this.list.prepend(itemView);
			} else {
				this.list.append(itemView);
			}
		},
		toggleState: function(state) {
			this.el.find('.thinkDoToggle').text(["Think", "Do"][state]);
		}
	});

	return ListView;

});