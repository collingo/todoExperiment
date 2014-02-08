/*global module: true */
var customJsGlob = [
		'./*.js',
		'./dev/js/**/*.js',
		'./dev/mods/**/*.js'
	],
	customCssGlob = [
		'./dev/css/**/*.{less,styl,scss,sass}',
		'./dev/mods/**/*.{less,styl,scss,sass}'
	],
	requireConfig = require('./dev/js/config'),
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
					sourceMapBasepath: 'dev/',
					sourceMapRootpath: '/'
				},
				files: {
					'dev/css/style.css': 'dev/css/style.less'
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
				src: ['dev/mods/*/*.js', '!dev/mods/*/*spec.js'],
				options: {
					specs: 'dev/mods/*/*spec.js',
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfig: _.extend({}, requireConfig, {
							baseUrl: 'dev/'
						})
					}
				}
			}
		},

		clean: {
			www: ['www','www/**'],
			built: [
				'www/libs/**/*',
				'!www/libs',
				'!www/libs/requirejs',
				'!www/libs/requirejs/require.js',
				'!www/libs/modernizr',
				'!www/libs/modernizr/modernizr.js',
				'!www/libs/normalize-less',
				'!www/libs/normalize-less/normalize.less'
			]
		},

		uglify: {
			config: {
				files: {
					"www/js/config.js": "www/js/config.js"
				}
			},
			libs: {
				files: [{
					expand: true,
					cwd: 'www/libs/',
					src: ['**/*.js'],
					dest: 'www/libs/'
				}]
			}
		},

		copy: {
			www: {
				files: [{
					expand: true,
					cwd: 'dev/',
					src: ['**'],
					dest: 'www/'
				}]
			}
		},

		processhtml: {
			options: {
				// Task-specific options go here.
			},
			build: {
				files: {
					'www/index.html': ['www/index.html']
				}
			}
		},

		requirejs: {
			build: {
				options: _.extend({}, requireConfig, {
					baseUrl: "www",
					almond: true,
					name: 'libs/almond/almond',
					include: ['js/init.js'],
					out: "www/js/init.js",
					mainConfigFile: "www/js/config.js",
					optimize: 'uglify2',
					generateSourceMaps: true,
					preserveLicenseComments: false,
					skipDirOptimize: true,
					optimizeCss: false,
					wrap: true,
					// dir: 'www',
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
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-processhtml');

	// helper tasks (do not call from command line)
	grunt.registerTask('css', ['less']);
	grunt.registerTask('server', 'Start a custom web server', function() {
		require('./server.js');
	});

	// command line tasks
	grunt.registerTask('default', ['css', 'jshint', 'server', 'watch']);
	grunt.registerTask('test', 'Run the tests', function(module) {
		var jsPath, specPath;
		if (arguments.length > 0) {
			jsPath = 'dev/mods/'+module+'/'+module+'.js',
			specPath = 'dev/mods/'+module+'/'+module+'-spec.js';
			grunt.config.set('jasmine.run.src', [jsPath]);
			grunt.config.set('jasmine.run.options.specs', [specPath]);
			grunt.log.writeln("Testing " + module);
		} else {
			grunt.log.writeln('Running all tests');
		}
		grunt.task.run('jasmine');
	});
	grunt.registerTask('build', ['clean:www', 'jshint', 'css', 'copy', 'requirejs', 'clean:built', 'processhtml', 'uglify']);

};
