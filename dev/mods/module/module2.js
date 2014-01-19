define([
	'jquery',
	'underscore/arrays/indexOf',
	'hbars!mods/module/module'
],
function(
	$,
	_indexOf,
	template
){
	console.log('_indexOf 2 in [1,2,3]', _indexOf([1,2,3], 2));
	console.log("module2 initialized");
	$('body').append(template({name:"Nick"}));
	return "hi";
});
