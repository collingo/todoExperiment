function Stitch(mod, tpl, dom) {
	if(!mod) throw new Error('Missing model and template');
	if(typeof tpl !== 'string') throw new Error('Missing template');
	
	if(dom) {
		return Stitch.stitch.apply(this, arguments);
	} else {
		return Stitch.html.apply(this, arguments);
	}
}
Stitch.html = require('./buildHtml');
Stitch.stitch = require('./stitchDom');
Stitch.dom = require('./buildDom');

module.exports = Stitch;