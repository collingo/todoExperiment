/*global module: true */
var clientDir = 'client/',
	clientDirRelative = './'+clientDir,
	customJsGlob = [
		'./*.js',
		clientDirRelative+'js/**/*.js',
		clientDirRelative+'mods/**/*.js'
	],
	customCssGlob = [
		clientDirRelative+'css/**/*.{less,styl,scss,sass}',
		clientDirRelative+'mods/**/*.{less,styl,scss,sass}'
	],
	requireConfig = require(clientDirRelative+'js/config'),
	_ = require('underscore'),
    gitrev = require('git-rev'),
    fs = require('fs');


module.exports = function (grunt) {

	var lessFiles = {};
	lessFiles[clientDirRelative+'css/style.css'] = clientDirRelative+'css/style.less';

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
					sourceMapFilename: clientDirRelative+'css/style.css.map',
					sourceMapBasepath: clientDirRelative,
					sourceMapRootpath: '../'
				},
				files: lessFiles
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
				src: [clientDir+'mods/*/*.js', '!'+clientDir+'mods/*/*spec.js'],
				options: {
					specs: clientDir+'mods/*/*spec.js',
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfig: _.extend({}, requireConfig, {
							baseUrl: clientDir
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
					cwd: clientDirRelative,
					src: ['**'],
					dest: 'www/'
				}]
			}
		},

		nodemon: {
			dev: {
				script: 'server/index.js'
			}
		},

		concurrent: {
			dev: {
				tasks: ['server', 'watch'],
				options: {
					logConcurrentOutput: true
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
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	// helper tasks (do not call from command line)
	grunt.registerTask('css', ['less']);
	grunt.registerTask('server', 'Start a custom web server', function() {
		grunt.task.run('nodemon');
	});
	grunt.registerTask('setupDevEnv', 'Setting up development environment', function() {
		grunt.task.run('concurrent:dev');
	});
	grunt.registerTask('cacheRev', 'Cache revision number of front end codebase', function() {
		var done = this.async();
		gitrev.short(function(currentRev) {
			fs.writeFile('./www/build.json', JSON.stringify({
				revision: currentRev
			}), 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
				done();
			});
		});
	});

	// command line tasks
	grunt.registerTask('default', ['css', 'jshint', 'setupDevEnv']);
	grunt.registerTask('test', 'Run the tests', function(module) {
		var specSetup;
		if (arguments.length > 0) {
			grunt.config.set('jasmine.run.src', [clientDir+'mods/'+module+'/'+module+'.js']);
			grunt.config.set('jasmine.run.options.specs', [clientDir+'mods/'+module+'/'+module+'-spec.js']);
			grunt.log.writeln("Testing " + module);
		} else {
			grunt.log.writeln('Running all tests');
			specSetup = grunt.config.get('jasmine.run');
			var newSetup = {};
			_.each(grunt.file.expand(grunt.config.get('jasmine.run.options.specs')), function(path) {
				var module = path.split('/')[2];
				newSetup[module] = _.extend({}, specSetup);
				newSetup[module].src = [clientDir+'mods/'+module+'/'+module+'.js'];
				newSetup[module].options = _.extend({}, specSetup.options);
				newSetup[module].options.specs = [clientDir+'mods/'+module+'/'+module+'-spec.js'];
			});
			grunt.config.set('jasmine', newSetup);
		}
		grunt.task.run('jasmine');
	});
	grunt.registerTask('build', ['clean:www', 'jshint', 'css', 'copy', 'requirejs', 'clean:built', 'uglify', 'cacheRev']);

};
