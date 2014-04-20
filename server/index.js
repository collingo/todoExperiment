var express = require('express');
var Q = require('q');
var path = require('path');
var gitrev = require('git-rev');
var mongo = require('mongodb');
var QMongoDB = require('q-mongodb');
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
		var getTodoData = todos.findOne({
			id: 'root'
		});
		var getAllData = todos.find().toArray();
		var getTemplate = readFile(__dirname + '/views/index.tck', "utf-8");
		Q.all([
			getTodoData,
			getAllData,
			getTemplate
		]).spread(function(todo, data, tpl) {
			res.send(stitch({
				todo: todo,
				data: JSON.stringify(data),
				rev: rev
			}, tpl));
		});
	});
	server.get('/:id', function(req, res) {
		if(req.params.id === 'favicon.ico') return;
		var getTodoData = todos.findOne({
			id: req.params.id
		});
		var getAllData = todos.find().toArray();
		var getTemplate = readFile(__dirname + '/views/index.tck', "utf-8");
		Q.all([
			getAllData,
			getTodoData,
			getTemplate
		]).spread(function(data, todo, tpl) {
			res.send(stitch({
				todo: todo,
				data: JSON.stringify(data),
				rev: rev
			}, tpl));
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
