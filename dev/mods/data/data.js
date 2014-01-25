define([
	'underscore/collections/where'
], function(
	_where
) {

	var storage = window.storage = [{
		"id": 0,
		"text": "Think.Do.",
		"children": [1,2,3,4]
	}, {
		"id": 1,
		"text": "Work",
		"done": false,
		"children": [5],
		"parent": 0
	}, {
		"id": 2,
		"text": "Shopping",
		"done": false,
		"children": [6,7],
		"parent": 0
	}, {
		"id": 3,
		"text": "Phone Mum",
		"done": false,
		"children": [],
		"parent": 0
	},{
		"id": 4,
		"text": "Clean house",
		"done": false,
		"children": [],
		"parent": 0
	},{
		"id": 5,
		"text": "Email client",
		"done": false,
		"children": [],
		"parent": 1
	},{
		"id": 6,
		"text": "Milk",
		"done": false,
		"children": [],
		"parent": 2
	}, {
		"id": 7,
		"text": "Bread",
		"done": false,
		"children": [],
		"parent": 2
	}];

	var data = {
		get: function(id) {
			return _where(storage, {
				id: id
			})[0];
		}
	};

	return data;

});