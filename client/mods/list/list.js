define([
	'dom',
	'hbars!mods/list/list',
	'underscore/collections/forEach',
	'underscore/objects/assign',
	'mods/item/item',
	'events'
],
function(
	dom,
	template,
	_forEach,
	_extend,
	ItemView,
	events
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
			this.el.find('.toolbar').on('touchmove', this.onScrollToolbar.bind(this));
			this.input.on('keypress', this.onKeyPress.bind(this));
		},
		onNav: function(e) {
			e.preventDefault();
			events.fire('go', this.data.parent.id);
		},
		onScrollToolbar: function(e) {
			e.preventDefault();
		},
		onKeyPress: function(e) {
			if(e.keyCode === 13) {
				e.preventDefault();
				console.log(this.input.val());
				this.addNew(this.input.val());
			}
		},

		// methods
		render: function() {
			var viewdata = _extend({}, this.data);
			viewdata.hasParent = this.data.hasOwnProperty('parent');
			this.el = dom(template(viewdata));
			this.list = this.el.find('ul');
			this.input = this.el.find('input');
			this.renderChildren.call(this);
		},
		renderChildren: function() {
			_forEach(this.data.children, this.appendChild.bind(this));
		},
		addNew: function(text) {
			document.querySelector('input').value = '';
			this.appendChild({
				id: data.length,
				text: text,
				children: []
			});
			events.fire('stitch');
		},
		appendChild: function(childData) {
			var item = new ItemView(_extend({}, childData));
			this.list.append(item);
		}
	});

	return ListView;

});