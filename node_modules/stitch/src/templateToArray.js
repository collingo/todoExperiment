module.exports = function templateToArray(tpl) {
	if(!tpl) return [];

	var match = tpl.match(/<\/?[a-z]+[^>]*>|\{\{[a-zA-Z\.]+\}\}|[a-zA-Z]+/g);
	var i, tag, tags = [];
	for (i = 0; i < match.length; i++) {
		tag = getTag(match[i]);
		if(tag) {
			tag.attributes = getAttributesHash(match[i]);
			tags.push(tag);
		}
	}

	function getTag(tagString) {
		var tag = {};
		if(tagString.charAt(0) === "<") {
			var match = tagString.match(/^<(\/?)([a-z0-9]+)/);
			if(!match[1].length) {
				// opening tag
				tag.type = match[2];
				if(tagString.charAt(tagString.length-2) === '/') {
					tag.self = true;
				}
			} else {
				// closing tag
				tag.type = match[2];
				tag.close = true;
			}
		} else {
			var placeholder = tagString.match(/^\{\{([a-zA-Z\.]+)\}\}/);
			if(placeholder) {
				tag.type = '>';
				tag.bind = placeholder[1];
			} else {
				tag.type = "#text";
				tag.value = tagString;
			}
		}
		return tag;
	}

	function getAttributesHash(tagString) {
		var hash = {};
		var match = tagString.match(/([a-z]+\=\"[^\"]*\")/g);
		var attr;
		if(match) {
			for(var i = 0; i < match.length; i++) {
				attr = match[i].split('=');
				var placeholder = attr[1].match(/\{\{([a-zA-Z\.]+)\}\}/);
				if(placeholder) {
					hash[attr[0]] = {
						type: '>',
						bind: placeholder[1]
					};
				} else {
					hash[attr[0]] = attr[1].match(/^[\"]*([\{\}a-zA-Z1-9\. ]+)/)[1];
				}
			}
		}
		return hash;
	}

	return tags;
};