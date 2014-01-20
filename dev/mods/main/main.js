define([
	'underscore/objects/assign',
	'underscore/collections/forEach',
	'underscore/collections/where',
	'jquery',
	'crossroads',
	'hasher',

	'mods/list/list'
], function(
	_extend,
	_forEach,
	_where,
	$,
	crossroads,
	hasher,

	ListView
) {

	window.data = [{
		"id": 0,
		"text": "Think.Do",
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

	var todos = {
		get: function(id) {
			return _where(window.data, {
				id: id
			})[0];
		}
	};

	//handle hash changes
	function handleChanges(newHash, oldHash){
		var data = buildViewObject(parseInt(newHash, 10) || 0);
		$('body').empty().append(new ListView(data));
	}

	hasher.changed.add(handleChanges); //add hash change listener
	hasher.initialized.add(handleChanges); //add initialized listener (to grab initial value in case it is already set)
	hasher.init(); //initialize hasher (start listening for history changes)

	hasher.setHash(0); //change hash value (generates new history record)

	function buildViewObject(id) {
		var obj = _extend({}, todos.get(id));
		if(obj.children.length) {
			var children = [];
			_forEach(obj.children, function(id) {
				children.push(_extend({}, todos.get(id)));
			});
			obj.children = children;
		}
		if(obj.parent) {
			var parentChildren = [];
			obj.parent = todos.get(id);
			_forEach(obj.parent.children, function(id) {
				parentChildren.push(_extend({}, todos.get(id)));
			});
			obj.parent.children = parentChildren;
		}
		return obj;
	}

});