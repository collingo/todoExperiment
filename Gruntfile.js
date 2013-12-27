/*global module: true */
var customJsGlob = [
		'./*.js',
		'./www/js/**/*.js',
		'./www/mods/**/*.js'
	],
	customCssGlob = [
		'./www/css/**/*.{less,styl,scss,sass}',
		'./www/mods/**/*.{less,styl,scss,sass}'
	],
	requireConfig = require('./www/js/config'),
	_ = require('underscore');

module.exports = function (grunt) {

	//Config
	grunt.initConfig({

		watch: {
			css: {
				files: customCssGlob,
				tasks: ['css']
			},
			js: {
				files: customJsGlob.concat(['./.jshintrc']),
				tasks: ['jshint']
			}
		},

		less: {
			compile: {
				options: {
					compress: true,
					sourceMap: true,
					sourceMapFilename: 'css/style.css.map',
					sourceMapBasepath: 'www/',
					sourceMapRootpath: '/'
				},
				files: {
					'www/css/style.css': 'www/css/style.less'
				}
			}
		},

		jshint: {
			options: {
				jshintrc: './.jshintrc'
			},
			files: customJsGlob
		},

		jasmine: {
			run: {
				src: ['www/mods/*/*.js', '!www/mods/*/*spec.js'],
				options: {
					specs: 'www/mods/*/*spec.js',
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfig: _.extend({}, requireConfig, {
							baseUrl: 'www/'
						})
					}
				}
			}
		},

		clean: {
			newBuild: ['dist','dist/**'],
			dist: [
				'dist/libs/**/*',
				'!dist/libs',
				'!dist/libs/requirejs',
				'!dist/libs/requirejs/require.js',
				'!dist/libs/modernizr',
				'!dist/libs/modernizr/modernizr.js',
				'!dist/libs/normalize-less',
				'!dist/libs/normalize-less/normalize.less'
			]
		},

		uglify: {
			config: {
				files: {
					"dist/js/config.js": "dist/js/config.js"
				}
			},
			libs: {
				files: [{
					expand: true,
					cwd: 'dist/libs/',
					src: ['**/*.js'],
					dest: 'dist/libs/'
				}]
			}
		},

		requirejs: {
			dist: {
				options: _.extend({}, requireConfig, {
					baseUrl: "www",
					name: 'js/init',
					mainConfigFile: "www/js/config.js",
					optimize: 'uglify2',
					generateSourceMaps: true,
					preserveLicenseComments: false,
					skipDirOptimize: true,
					optimizeCss: false,
					wrap: true,
					dir: 'dist',
					normalizeDirDefines: 'all',
					stubModules: ['text', 'hbars'],
					removeCombined: true
				})
			}
		}

	});

	// load grunt plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// helper tasks (do not call from command line)
	grunt.registerTask('css', ['less']);
	grunt.registerTask('server', 'Start a custom web server', function() {
		require('./server.js');
		grunt.log.writeln('Local development server started on http://localhost:8080/');
		grunt.log.writeln('Local distribution server started on http://localhost:9090/');
	});

	// command line tasks
	grunt.registerTask('default', ['css', 'jshint', 'server', 'watch']);
	grunt.registerTask('test', 'Run the tests', function(module) {
		var jsPath, specPath;
		if (arguments.length > 0) {
			jsPath = 'www/mods/'+module+'/'+module+'.js',
			specPath = 'www/mods/'+module+'/'+module+'-spec.js';
			grunt.config.set('jasmine.run.src', [jsPath]);
			grunt.config.set('jasmine.run.options.specs', [specPath]);
			grunt.log.writeln("Testing " + module);
		} else {
			grunt.log.writeln('Running all tests');
		}
		grunt.task.run('jasmine');
	});
	grunt.registerTask('build', ['clean:newBuild', 'jshint', 'css', 'requirejs', 'clean:dist', 'uglify']);

};
