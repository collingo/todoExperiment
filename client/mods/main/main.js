define([
	'libs/fastclick/lib/fastclick',
	'router'
], function(
	FastClick,
	router
) {

	FastClick.attach(document.body);

	router.init(window.initId);

});