define([
	'underscore/collections/where',
	'jquery'
], function(
	_where,
	$
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
			$.ajax({
				url: '/todos',
				type: "post",
				data: JSON.stringify(data.todo),
				contentType: 'application/json',
				processData: false,
				error: function() {
					console.log('error', data.guid);
				},
				success: function(todo) {
					store[todo.parent].children.unshift(todo.id);
					done({
						todo: todo,
						guid: data.guid
					});
				}
			});
		},
		set: function(dataToStore) {
			store[dataToStore.id] = dataToStore;
		}
	};

	return storage;

});