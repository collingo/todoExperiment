define([
	'mods/module/module2'
],
function(
	module2
){
	console.log("module initialized");
	return {
		test: "hello",
		test2: module2
	};
});
