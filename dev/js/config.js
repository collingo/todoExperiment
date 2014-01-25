var config = {

	baseUrl: './',

	deps: ['js/init'],

	paths: {
		underscore: 'libs/lodash-amd/modern',
		jquery: 'libs/jquery/jquery',
		text: 'libs/requirejs-text/text',
		Handlebars: 'libs/handlebars/handlebars',
		hbars: 'libs/requirejs-handlebars/hbars',
		crossroads: 'libs/crossroads/dist/crossroads',
		signals: 'libs/signals/dist/signals',
		hasher: 'libs/hasher/dist/js/hasher',
		history: 'libs/history/scripts/uncompressed/history',
		router: 'mods/router/router',
		events: 'mods/events/events'
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
