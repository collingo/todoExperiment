var watch = require('watchjs').watch;
module.exports = Object.observe || function(o, cb) {
	watch(o, function(prop, action, newValue, oldValue) {
		cb([{
			object: o,
			type: action,
			name: prop,
			oldValue: oldValue
		}]);
	});
};