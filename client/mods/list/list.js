define([
	'dom',
	'hbars!mods/list/list',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'mods/item/item',
	'events',
	'mods/app/app'
],
function(
	dom,
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
		this.el.els[0].bindEvents = this.bindEvents.bind(this);
		return this.el;
	}
	ListView.prototype = _extend({}, {
		constructor: ListView,

		// events
		bindEvents: function() {
			this.el.find('.navButton').on('click', this.onNav.bind(this));
			this.el.find('.thinkDoToggle').on('click', this.onToggleState.bind(this));
			this.el.find('.toolbar').on('touchmove', this.onScrollToolbar.bind(this));
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
			this.el.find('.thinkDoToggle').text(["Think", "Do"][state]);
		},
		onScrollToolbar: function(e) {
			e.preventDefault();
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
			this.el = dom(template(viewdata));
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
			data.push({
				id: id,
				text: text,
				done: false,
				children: [],
				parent: this.data.id
			});
			data[this.data.id].children.unshift(id);
			this.addChild({
				id: id,
				text: text,
				done: false,
				children: [],
				parent: this.data.id
			}, true);
			events.fire('stitch');
		},
		addChild: function(childData, prepend) {
			var item = new ItemView(_extend({}, childData));
			if(prepend) {
				this.list.prepend(item);
			} else {
				this.list.append(item);
			}
		}
	});

	return ListView;

});