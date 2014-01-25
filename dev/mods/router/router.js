define([
	'underscore/objects/assign',
	'underscore/collections/forEach',
	'jquery',

	'mods/list/list',
	'mods/data/data',
	'mods/events/events'
], function(
	_extend,
	_forEach,
	$,

	ListView,
	data,
	events
) {

	function Router(routes) {
		this.routes = routes;

		history.replaceState({
			url: 0
		}, 0, 0);
		window.onpopstate = this.onPop.bind(this);
		this.onGo = this.onGo.bind(this);
		events.on('go', this.onGo);
	}
	Router.prototype = {
		constructor: Router,
		buildViewObject: function(id) {
			var obj = _extend({}, data.get(id));
			if(obj.children.length) {
				var children = [];
				_forEach(obj.children, function(id) {
					children.push(_extend({}, data.get(id)));
				});
				obj.children = children;
			}
			if(obj.parent) {
				var parentChildren = [];
				obj.parent = data.get(id);
				_forEach(obj.parent.children, function(id) {
					parentChildren.push(_extend({}, data.get(id)));
				});
				obj.parent.children = parentChildren;
			}
			return obj;
		},
		onPop: function(e) {
			events.fire('go', e.state.url, true);
		},
		onGo: function(to, isPop) {
			this.go(to, isPop);
		},
		go: function(to, isPop) {
			if(!isPop) {
				if(to) {
					history.pushState({
						url: to
					}, to, to);
				} else {
					history.pushState({
						url: 0
					}, 0, '/');
				}
			}

			var data = this.buildViewObject(parseInt(to, 10) || 0);
			$('body').empty().append(new ListView(data));
		}
	};

	return new Router({

	});

});