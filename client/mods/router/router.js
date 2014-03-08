define([
	'underscore/objects/cloneDeep',
	'underscore/collections/forEach',
	'dom',

	'mods/list/list',
	'routes/list/controller',
	'events',
	'dispatch'
], function(
	_clone,
	_forEach,
	$,

	ListView,
	listController,
	events,
	dispatch
) {

	events.on('stitch', function() {
		$('.dirty').forEach(function(item) {
			$(item)
				.removeClass('dirty')
				.els[0].bindEvents();
		});
	});

	function Router() {
		window.onpopstate = this.onPop.bind(this);
		this.onGo = this.onGo.bind(this);
		events.on('go', this.onGo);
	}
	Router.prototype = {
		constructor: Router,

		// handlers
		onPop: function(e) {
			events.fire('go', e.state.url, true);
		},
		onGo: function(to, isPop) {
			this.go(to, isPop);
		},

		// methods
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
		go: function(to, isPop) {
			if(!isPop) {
				this.push(to);
			}
			this.processView(to);
		},
		processView: function(location) {
			var view = listController.render(parseInt(location, 10) || 0);
			dispatch(view);
			events.fire('stitch');
		}
	};

	var router = new Router();

	return {
		init: router.init.bind(router)
	};

});