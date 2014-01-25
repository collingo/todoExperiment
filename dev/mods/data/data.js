define([
	'underscore/collections/where'
], function(
	_where
) {

	var storage = window.storage = [{
		"id": 0,
		"text": "Think.Do.",
		"children": [1,2,3,4,8,9,10,11,12,13,14,15]
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
	},{
		"id": 8,
		"text": "Clean house",
		"done": false,
		"children": [],
		"parent": 0
	},{
		"id": 9,
		"text": "Email client",
		"done": false,
		"children": [],
		"parent": 0
	},{
		"id": 10,
		"text": "Milk",
		"done": false,
		"children": [],
		"parent": 0
	}, {
		"id": 11,
		"text": "Bread",
		"done": false,
		"children": [],
		"parent": 0
	},{
		"id": 12,
		"text": "Clean house",
		"done": false,
		"children": [],
		"parent": 0
	},{
		"id": 13,
		"text": "Email client",
		"done": false,
		"children": [],
		"parent": 0
	},{
		"id": 14,
		"text": "Milk",
		"done": false,
		"children": [],
		"parent": 0
	}, {
		"id": 15,
		"text": "Bread",
		"done": false,
		"children": [],
		"parent": 0
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