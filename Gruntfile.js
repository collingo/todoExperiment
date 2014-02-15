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
					sourceMapFilename: 'dev/css/style.css.map',
					sourceMapBasepath: 'dev/',
					sourceMapRootpath: '../'
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
				'www/js/config.js',
				'www/libs/**/*',
				'www/mods/*/*.html',
				'www/mods/*/*.hb',
				'www/mods/*/*-spec.js',
				'!www/libs',
				'!www/libs/normalize-less',
				'!www/libs/normalize-less/normalize.less'
			]
		},

		uglify: {
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
					'www/index.hbs': ['www/index.hbs']
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
	grunt.registerTask('test', 'Run the tests', function(moduleToTest) {
		var allSpecs,
			specSetup,
			module = moduleToTest;
		if (arguments.length > 0) {
			grunt.config.set('jasmine.run.src', ['dev/mods/'+module+'/'+module+'.js']);
			grunt.config.set('jasmine.run.options.specs', ['dev/mods/'+module+'/'+module+'-spec.js']);
			grunt.log.writeln("Testing " + module);
		} else {
			grunt.log.writeln('Running all tests');
			specSetup = grunt.config.get('jasmine.run');
			var newSetup = {};
			_.each(grunt.file.expand(grunt.config.get('jasmine.run.options.specs')), function(path) {
				var module = path.split('/')[2];
				newSetup[module] = _.extend({}, specSetup);
				newSetup[module].src = ['dev/mods/'+module+'/'+module+'.js'];
				newSetup[module].options = _.extend({}, specSetup.options);
				newSetup[module].options.specs = ['dev/mods/'+module+'/'+module+'-spec.js'];
			});
			grunt.config.set('jasmine', newSetup);
		}
		grunt.task.run('jasmine');
	});
	grunt.registerTask('build', ['clean:www', 'jshint', 'css', 'copy', 'requirejs', 'clean:built', 'processhtml', 'uglify']);

};
