var config = {

	baseUrl: './',

	deps: ['js/init'],

	paths: {
		underscore: 'libs/lodash-amd/modern',
		jquery: 'libs/jquery/jquery',
		text: 'libs/requirejs-text/text',
		Handlebars: 'libs/handlebars/handlebars',
		hbars: 'libs/requirejs-handlebars/hbars'
	},

	shim: {
		Handlebars: {
			exports: 'Handlebars',
			init: function() {
				this.Handlebars = Handlebars;
				return this.Handlebars;
			}
		}
	},

	hbars: {
		extension: '.hb',
		compileOptions: {}
	}

};

if(typeof module !== 'undefined') {
	module.exports = config;
}
if(typeof require !== 'undefined' && !require.main) {
	require.config(config);
}
