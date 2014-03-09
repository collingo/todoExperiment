define([
	'libs/fastclick/lib/fastclick',
	'router',
	'mods/app/app'
], function(
	FastClick,
	router,
	app
) {

	FastClick.attach(document.body);

	router.init(window.initId);

});