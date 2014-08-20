var domModeler = require('./templateToArray');

module.exports = function(mod, tpl) {
	if(!arguments.length) throw new Error("Missing model and template");
	if(typeof mod !== 'object') throw new Error("Model must be plain object"); 
	if(!tpl) throw new Error("Missing template");
	if(typeof tpl !== 'string') throw new Error("Template must be a string");

	var getNested = function(model, location) {
		var locationArr = location.split('.');
		var result = model;
		for (var i = 0; i < locationArr.length; i++) {
			result = result[locationArr[i]];
		}
		return result;
	};
	var loopRepeats = function(items, domPartialModel) {
		var html = '';
		for(var i = 0; i < items.length; i++) {
			var model = items[i];
			if(typeof items[i] !== "object") {
				model = {
					value: items[i]
				};
			}
			html += buildHtml(domPartialModel.slice(0), model);
		}
		return html;
	};
	var buildAttrString = function(attributes, model) {
		var html = '';
		for(var key in attributes) {
			if(attributes[key].bind) {
				html += ' ' + key + '="' + getNested(model, attributes[key].bind) +'"';
			} else {
				html += ' ' + key + '="' + attributes[key] +'"';
			}
		}
		return html;
	};
	var buildTagString = function(tag, model) {
		var html = '<';
		if(tag.close) html += '/';
		html += tag.type;
		html += buildAttrString(tag.attributes, model);
		if(tag.type === 'input') html += ' /';
		html += '>';
		return html;
	};
	var getPartial = function(domModel) {
		var dom = [];
		var stack = [];
		if(!domModel[0].close) {
			var domItem = domModel.shift();
			dom.push(domItem);
			stack.push(domItem.type);
			while(stack.length) {
				domItem = domModel.shift();
				if(domItem.type !== '>') {
					if(domItem.close) {
						stack.pop();
					} else {
						if(!domItem.self) {
							stack.push(domItem.type);
						}
					}
				}
				dom.push(domItem);
			}
		}
		return dom;
	};
	var buildHtml = function(domModel, model) {
		var html = '';
		while(domModel.length) {
			var domItem = domModel.shift();
			switch(domItem.type) {
				case '>':
					// placeholder
					var value = getNested(model, domItem.bind);
					html += (value === undefined) ? '{{'+domItem.bind+'}}' : value;
				break;
				case '#text':
					html += domItem.value;
				break;
				default:
					html += buildTagString(domItem, model);
					if(domItem.attributes.repeat) {
						var items = getNested(model, domItem.attributes.repeat);
						var partial = getPartial(domModel);
						html += loopRepeats(items, partial);
					}
				break;
			}
		}
		return html;
	};

	return buildHtml(domModeler(tpl), mod);
};