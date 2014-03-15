define([
	'underscore/collections/where',
	'underscore/arrays/findIndex',
	'underscore/objects/assign',
	'underscore/objects/clone',
	'jquery'
], function(
	_where,
	_findIndex,
	_extend,
	_clone,
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
		set: function(id, data) {
			var index = _findIndex(store, {id:id});
			if(index > -1) {
				store[index] = data;
			} else {
				store[store.length] = data;
			}
		},
		change: function(id, changeSet) {
			storage.set(id, _extend(storage.get(id), changeSet));
		},
		remove: function(id) {
			delete store[_findIndex(store, {id:id})];
		},

		add: function(data, done) {
			data.todo.id = store.length;
			storage.set(data.todo.id, data.todo);
			var cachedParentsChildren = [].concat(storage.get(data.todo.parent).children);
			var changedParentsChildren = [].concat(cachedParentsChildren);
			changedParentsChildren.unshift(data.todo.id);
			storage.change(data.todo.parent, {
				children: changedParentsChildren
			});
			$.ajax({
				url: '/todos',
				type: "post",
				data: JSON.stringify(data.todo),
				contentType: 'application/json',
				processData: false,
				timeout: 10000,
				error: function() {
					storage.change(data.todo.parent, {
						children: cachedParentsChildren
					});
					console.log('error', data.guid);
					done({
						status: 0,
						todo: data.todo,
						guid: data.guid
					});
				},
				success: function(todo) {
					storage.set(todo.id, todo);
					done({
						status: 1,
						todo: todo,
						guid: data.guid
					});
				}
			});
		},
		update: function(data, done) {
			storage.change(data.id, data.change);
			$.ajax({
				url: '/todos/'+data.id,
				type: "put",
				data: JSON.stringify(data.change),
				contentType: 'application/json',
				processData: false,
				timeout: 10000,
				error: function() {
					storage.change(data.id, data.old);
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