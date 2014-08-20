var templateToArray = require('./templateToArray');
var observe = require('./observe');

module.exports = function(mod, tpl, dom) {
	if(!mod) throw new Error("Missing model, template and dom");
	if(typeof tpl !== 'string') throw new Error("Missing template and dom");
	if(!dom) throw new Error("Missing dom");

	var nodeWalkCount = 0;
	var bindings = {};
	var tplArray = templateToArray(tpl);

	function walkTheDOM(node, func) {
		func(node);
		node = node.firstChild;
		while (node) {
			walkTheDOM(node, func);
			node = node.nextSibling;
		}
	}

	function bindData(prop, node) {
		bindings[prop] = function(value) {
			node.data = value;
		};
	}

	function bindAttr(prop, node, attr) {
		bindings[prop] = function(value) {
			node.setAttribute(attr, !!value);
		};
	}

	function onModelChange(changes) {
		for (var i = 0; i < changes.length; i++) {
			bindings[changes[i].name](changes[i].object[changes[i].name]);
		}
	}

	walkTheDOM(dom, function(node) {
		if(!(node.nodeName === "#text" && node.data.charAt(0) === "\n")) {
			var expected = tplArray[nodeWalkCount];
			if(expected.type === ">") {
				bindData(expected.bind, node);
			} else {
				if(node.nodeName.toLowerCase() !== expected.type) {
					throw new Error('Node does not match template, got <' + node.nodeName.toLowerCase() + '> expecting <' + expected.type + '>', node.nodeName.toLowerCase(), expected);
				}
				var attrHash = expected.attributes;
				for(var attr in attrHash) {
					if(attrHash.hasOwnProperty(attr)) {
						var expression = attrHash[attr].match(/^\{\{([a-zA-Z]+)\}\}/)[1];
						if(expression) {
							bindAttr(expression, node, attr);
						}
					}
				}
			}
			nodeWalkCount++;
		}
	});

	observe(mod, onModelChange);

	return dom;
};