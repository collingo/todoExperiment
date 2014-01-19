define([
	'underscore/collections/forEach',
	'jquery'
], function(
	_forEach,
	$
) {

	var data = [{
		"id": 0,
		"text": "Todo",
		"done": false,
		"items": [{
			"id": 4,
			"text": "Clean house",
			"done": false
		}]
	}, {
		"id": 1,
		"text": "Work",
		"done": false,
		"items": [{
			"id": 5,
			"text": "Email client",
			"done": false
		}]
	}, {
		"id": 2,
		"text": "Shopping",
		"done": false,
		"items": [{
			"id": 6,
			"text": "Milk",
			"done": false
		}, {
			"id": 7,
			"text": "Bread",
			"done": false
		}]
	}, {
		"id": 3,
		"text": "Phone Mum",
		"done": false
	}];

	var html = "<ul>";
	_forEach(data, function(item, index) {
		console.log(item.text);
		html += "<li><p>"+item.text+"</p>";

		if(item.items) {
			_forEach(item.items, function(subitem, subindex) {
				console.log(">", subitem.text);
			});
		}
		html += "</li>";
	});
	html += "</ul>";

	$('body').append(html);

	function renderItem(item) {

	}

});