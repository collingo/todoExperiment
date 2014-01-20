define([
	'underscore/collections/forEach',
	'underscore/collections/where',
	'jquery'
], function(
	_forEach,
	_where,
	$
) {

	var data = [{
		"id": 0,
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

	$('body').append('<h1>Think.Do</h1>');

	var todos = {
		get: function(id) {
			return _where(data, {
				id: id
			})[0];
		}
	};

	var todo0 = todos.get(0);

	// recursive
	function recursiveRender(children) {
		var html = "<ul>";
		_forEach(children, function(id) {
			var todo = todos.get(id);
			console.log(id, todo);
			html += '<li><p>'+todo.text+'<input type="checkbox" /></p>';
			if(todo.children.length) {
				html += recursiveRender(todo.children);
			}
			html += '</li>';
		});
		return html+"</ul>";
	}
	var html = recursiveRender(todo0.children);
	$('body').append(html);

	// paginated
	function renderList(todo) {
		var html = '<ul>';
		_forEach(todo.children, function(id) {
			var child = todos.get(id);
			console.log(id, child);
			html += '<li><p>'+child.text+'<input type="checkbox" /></p></li>';
		});
		return html+"</ul>";
	}
	var todo2 = todos.get(2);
	var todoP = todos.get(todo2.parent);
	var htmlP = renderList(todoP);
	$('body').append(htmlP);
	var html0 = renderList(todo2);
	$('body').append(html0);


});