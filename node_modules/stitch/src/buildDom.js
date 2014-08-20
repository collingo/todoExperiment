var buildHtml = require('./buildHtml');
var stitchDom = require('./stitchDom');

module.exports = function(mod, tpl) {
	if(!mod) throw new Error('Missing model and template');
	if(typeof tpl !== 'string') throw new Error('Missing template');

	var container = (arguments[2] || document).createElement('div');
	container.innerHTML = buildHtml(mod, tpl);

	return stitchDom(mod, tpl, container.firstChild);
};