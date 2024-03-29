var config = {

	baseUrl: './',

	deps: ['js/init'],

	paths: {
		underscore: 'libs/lodash-amd/modern',
		jquery: 'libs/jquery/dist/jquery',
		text: 'libs/requirejs-text/text',
		Handlebars: 'libs/handlebars/handlebars',
		hbars: 'libs/requirejs-handlebars/hbars',
		signals: 'libs/signals/dist/signals',
		history: 'libs/history/scripts/uncompressed/history',
		router: 'mods/router/router',
		events: 'mods/events/events',

		// mixins
		envMixin: 'mods/mixins/env/client',
		dispatch: 'mods/dispatch/client'
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
