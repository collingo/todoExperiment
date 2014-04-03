define([
	'jquery',
	'hbars!mods/toolbar/toolbar',
	'underscore/objects/assign',
	'underscore/functions/bindAll',
	'events',
	'mods/app/app'
],
function(
	$,
	template,
	_extend,
	_bindAll,
	events,
	app
){

	function ToolbarView(data) {
		_bindAll(this,
			'onChangeState',
			'onNav',
			'onToggleState',
			'onScrollToolbar',
			'onInputBlur',
			'onKeyUp',
			'onKeyPress'
		);
		this.data = data;
		this.render.call(this);
		this.el[0].bindEvents = this.bindEvents.bind(this);
		return this.el;
	}
	ToolbarView.prototype = _extend({}, {
		constructor: ToolbarView,

		// events
		bindEvents: function() {
			this.el.on('touchmove', this.onScrollToolbar);
			this.el.find('.navButton').on('click', this.onNav);
			this.el.find('.thinkDoToggle').on('click', this.onToggleState);
			this.input.on('blur', this.onInputBlur);
			this.input.on('keypress', this.onKeyPress);
			this.input.on('keyup', this.onKeyUp);
			events.on('changeState', this.onChangeState);
		},
		onChangeState: function(state) {
			this.toggleState(state);
		},
		onNav: function(e) {
			e.preventDefault();
			events.fire('go', this.data.parent.id);
		},
		onToggleState: function(e) {
			e.preventDefault();
			events.fire('toggleState');
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

		// methods
		render: function() {
			var viewdata = _extend({}, this.data, {
				app: app
			});
			viewdata.hasParent = this.data.hasOwnProperty('parent');
			this.el = $(template(viewdata));
			this.input = this.el.find('input');
		},
		toggleState: function(state) {
			this.el.find('.thinkDoToggle').text(["Think", "Do"][state]);
		},
		addNew: function(text) {
			events.fire('newItem', text);
		}
	});

	return ToolbarView;

});