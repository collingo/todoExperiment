define([
	'underscore/collections/where',
	'underscore/arrays/findIndex',
	'underscore/objects/assign',
	'jquery'
], function(
	_where,
	_findIndex,
	_extend,
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
		set: function(data) {
			store[_findIndex(store, {id:data.id})] = data;
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
		update: function(data, done) {
			storage.set(_extend(storage.get(data.id), data.change));
			$.ajax({
				url: '/todos/'+data.id,
				type: "put",
				data: JSON.stringify(data.change),
				contentType: 'application/json',
				processData: false,
				error: function() {
					storage.set(_extend(storage.get(data.id), data.old));
					console.log('error', data.guid);
				},
				success: function(todo) {
					done({
						todo: todo,
						guid: data.guid
					});
				}
			});
		}
	};

	return storage;

});