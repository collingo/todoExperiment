define([
	'jquery',
	'hbars!mods/list/list',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'mods/item/item',
	'events',
	'mods/app/app'
],
function(
	$,
	template,
	_forEach,
	_extend,
	ItemView,
	events,
	app
){

	function ListView(data) {
		this.data = data;
		this.render.call(this);
		this.el[0].bindEvents = this.bindEvents.bind(this);
		if(!app.state && !this.data.children.length) {
			this.input[0].focus();
		}
		return this.el;
	}
	ListView.prototype = _extend({}, {
		constructor: ListView,

		// events
		bindEvents: function() {
			this.el.find('.navButton').on('click', this.onNav.bind(this));
			this.el.find('.thinkDoToggle').on('click', this.onToggleState.bind(this));
			this.el.find('.toolbar').on('touchmove', this.onScrollToolbar.bind(this));
			this.input.on('blur', this.onInputBlur.bind(this));
			this.input.on('keypress', this.onKeyPress.bind(this));
			events.on('changeState', this.onChangeState.bind(this));
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
			var value = this.input.val();
			if(value.length) {
				this.addNew(value);
			}
		},
		onKeyPress: function(e) {
			if(e.keyCode === 13) {
				e.preventDefault();
				this.addNew(this.input.val());
			}
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
		addNew: function(text) {
			document.querySelector('input').value = '';
			var id = data.length;
			var child = {
				id: id,
				text: text,
				done: false,
				children: [],
				parent: this.data.id
			};
			data.push(child);
			data[this.data.id].children.unshift(id);
			this.addChild({
				id: id,
				text: text,
				done: false,
				children: [],
				parent: this.data.id
			}, true);
			this.el.addClass('children');
			events.fire('stitch');
		},
		addChild: function(childData, prepend) {
			var item = new ItemView(_extend({}, childData));
			if(prepend) {
				this.list.prepend(item);
			} else {
				this.list.append(item);
			}
		},
		toggleState: function(state) {
			this.el.find('.thinkDoToggle').text(["Think", "Do"][state]);
		}
	});

	return ListView;

});