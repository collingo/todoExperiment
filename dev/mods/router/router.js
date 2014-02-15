define([
	'underscore/objects/cloneDeep',
	'underscore/collections/forEach',
	'dom',

	'mods/list/list',
	'mods/data/data',
	'events'
], function(
	_clone,
	_forEach,
	$,

	ListView,
	data,
	events
) {

	function Router() {
		window.onpopstate = this.onPop.bind(this);
		this.onGo = this.onGo.bind(this);
		events.on('go', this.onGo);
	}
	Router.prototype = {
		constructor: Router,
		init: function(id) {
			this.replace(id);
			this.processView(id);
		},
		push: function(to) {
			to = to || '/';
			history.pushState({
				url: to
			}, to, to);
		},
		replace: function(to) {
			to = to || '/';
			history.replaceState({
				url: to
			}, to, to);
		},
		buildViewObject: function(id) {
			var obj = _clone(data.get(id));
			if(obj.children.length) {
				var children = [];
				_forEach(obj.children, function(id) {
					children.push(_clone(data.get(id)));
				});
				obj.children = children;
			}
			if(obj.parent) {
				var parentChildren = [];
				obj.parent = data.get(obj.parent);
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
				this.push(to);
			}
			this.processView(to);
		},
		processView: function(location) {
			var viewdata = this.buildViewObject(parseInt(location, 10) || 0);

			$('body')
				.empty()
				.append(
					new ListView(viewdata)
				);
		}
	};

	var router = new Router();

	return {
		init: router.init.bind(router)
	};

});