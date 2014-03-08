define([
	'underscore/collections/where'
], function(
	_where
) {

	var storage = {
		load: function(dataToLoad) {
			data = window.data = dataToLoad;
		},
		get: function(id) {
			return _where(data, {
				id: id
			})[0];
		}
	};

	return storage;

});