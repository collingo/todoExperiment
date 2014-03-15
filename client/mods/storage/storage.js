define([
	'underscore/collections/where'
], function(
	_where
) {

	var storage = window.storage = {
		load: function(data) {
			store = window.store = data;
		},
		get: function(id) {
			return _where(store, {
				id: id
			})[0];
		},
		add: function(data, done) {
			setTimeout(function() {
				data.todo.id = store.length;
				store[data.todo.id] = data.todo;
				store[data.todo.parent].children.unshift(data.todo.id);
				done(data);
			}, 2000);
		},
		set: function(dataToStore) {
			store[dataToStore.id] = dataToStore;
		}
	};

	return storage;

});