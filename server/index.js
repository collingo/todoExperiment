var express = require('express');
var Q = require('q');
var path = require('path');
var gitrev = require('git-rev');
var mongo = require('mongodb');
var _ = require('lodash');
var fs = require('fs');
var stitch = require('../../stitch/src/stitch');
var pmongo = require('promised-mongo');

var builtDir = path.resolve(__dirname + '/../www');
var devDir = path.resolve(__dirname + '/../client');
var rev = false;
var isDev = process.env.NODE_ENV !== "production";
var dbConnection = isDev ? 
	'mongodb://127.0.0.1:27017/thinkDo' :
	'mongodb://nodejitsu:28dac1b222ea09a3acd4e571893893e2@troup.mongohq.com:10042/nodejitsudb353559255';

var readFile = Q.denodeify(fs.readFile);
var db = pmongo(dbConnection, ['todos']);
var todos = db.todos;
var app = {
	state: "Do"
};

function flood(layout, regions) {
	return layout.replace(/region=\"([a-zA-Z]+?)\"([^>]*)>[^<]*</g, function() {
		return 'region="' + arguments[1] + '"' + arguments[2] + '>' + regions[arguments[1]] + '<';
	});
}

function setupServer(name, port, directory, built) {

	// setup
	var server = express();
	server.use(express.static(directory));
	server.use(function(req, res, next) {
		if(built) {
			rev = require(directory + '/build.json').revision;
			next();
		} else {
			gitrev.short(function(currentRev) {
				rev = currentRev;
				next();
			});
		}
	});

	// web
	server.get('/', function(req, res) {

		// data
		var todo = todos.findOne({
			id: 'root'
		});
		var all = todos.find().toArray();

		// templates
		var layout = readFile(__dirname + '/views/index.tck', "utf-8");
		var toolbar = readFile(path.resolve(__dirname + '/../client/mods/toolbar/toolbar.hb'), 'utf-8');
		var list = readFile(path.resolve(__dirname + '/../client/mods/list/list.hb'), 'utf-8');

		// build
		Q.all([
			todo,
			all,
			layout,
			toolbar,
			list
		]).spread(function(todo, data, layout, toolbarTpl, listTpl) {
			// layout = stitch({
			// 	app: app,
			// 	rev: rev
			// }, layout);
			todo.children = [{
				text: "Hello1",
				childCount: 9,
				done: true
			}, {
				text: "Hello2",
				childCount: 1,
				done: false
			}, {
				text: "Hello3",
				childCount: 4,
				done: false
			}];
			var toolbar = stitch({
				app: app,
				todo: todo
			}, toolbarTpl);
			var list = stitch({
				app: app,
				todo: todo
			}, listTpl);
			res.send(flood(layout, {
				toolbar: toolbar,
				content: list
			}));
		});

	});
	server.get('/:id', function(req, res) {
		if(req.params.id === 'favicon.ico') return;

		// data
		var todo = todos.findOne({
			id: req.params.id
		});
		var all = todos.find().toArray();

		// templates
		var layout = readFile(__dirname + '/views/index.tck', "utf-8");
		var toolbar = readFile(path.resolve(__dirname + '/../client/mods/toolbar/toolbar.hb'), 'utf-8');
		var list = readFile(path.resolve(__dirname + '/../client/mods/list/list.hb'), 'utf-8');

		// build
		Q.all([
			todo,
			all,
			layout,
			toolbar,
			list
		]).spread(function(todo, data, layout, toolbarTpl, listTpl) {
			layout = stitch({
				app: app,
				rev: rev
			}, layout);
			var toolbar = stitch({
				app: app,
				todo: todo
			}, toolbarTpl);
			var list = stitch({
				app: app,
				todo: todo
			}, listTpl);
			res.send(flood(layout, {
				toolbar: toolbar,
				content: list
			}));
		});

	});

	// api
	server.post('/todos', function(req, res) {
		var newTodo = req.body;
		newTodo.children = [];
		todosCollection.insert(req.body, function(err, todosAdded) {
			if(err) throw err;
			var savedTodo = todosAdded[0]
			var parentId = savedTodo.parent;
			todosCollection.findOne({id:parentId}, function(err, parent) {
				var childArray = parent.children;
				childArray.unshift(savedTodo.id);
				todosCollection.update({id:parentId}, {$set: {children:childArray}}, function() {
					setTimeout(function() {
						res.json(savedTodo);
					}, 2000);
				});
			});
		});
	});
	server.put('/todos/:id', function(req, res) {
		var id = req.params.id;
		todosCollection.update({id:id}, {$set: req.body}, function(err, updatedTodo) {
			if(err) throw err;
			todosCollection.findOne({id:id}, function(err, todo) {
				res.json(todo);
			});
		});
	});
	server.delete('/todos/:id', function(req, res) {
		var id = req.params.id;
		todosCollection.findOne({id:id}, function(err, todo) {
			var parentId = todo.parent;
			todosCollection.remove({id:id}, function(err, removed) {
				todosCollection.findOne({id:parentId}, function(err, parent) {
					var children = parent.children;
					todosCollection.update({id:parentId}, {$set: {children:_.reject(parent.children, function(num) {
						return num === id;
					})}}, function() {
						setTimeout(function() {
							res.json(removed);
						}, 2000);
					});
				});
			});
		});
	});

	// startup
	server.listen(port);
	console.log(name+" server started on http://localhost:"+port+"/");
	return server;
}

var built = setupServer("Built", 8080, builtDir, true);

// serve development code when not in production
if(isDev) {
	var dev = setupServer("Development", 8081, devDir, false);
}
