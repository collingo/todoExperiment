define([
	'libs/fastclick/lib/fastclick',
	'router',
	'events',
	'dom',
	'mods/app/app'
], function(
	FastClick,
	router,
	events,
	$,
	app
) {

	FastClick.attach(document.body);

	router.init(window.initId);

	function setState(state) {
		$('body').addClass(["Think", "Do"][state].toLowerCase());
		$('body').removeClass(["Think", "Do"][1 - state].toLowerCase());
	}
	events.on('changeState', setState);
	setState(app.state);

});