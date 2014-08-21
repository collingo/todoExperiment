var express = require('express');
var Q = require('q');
var path = require('path');
var mongo = require('mongodb');
var _ = require('lodash');
var fs = require('fs');
var stitch = require('stitch');
var pmongo = require('promised-mongo');

var builtDir = path.resolve(__dirname + '/../www');
var devDir = path.resolve(__dirname + '/../client');
var isDev = process.env.NODE_ENV !== "production";

var readFile = Q.denodeify(fs.readFile);
var app = {
	state: "Do"
};

var Firebase = require('firebase');
var db = new Firebase("https://blinding-fire-3623.firebaseIO.com/");
var usersRef = db.child('users');
var todosRef = db.child('todos');


function flood(layout, regions) {
	return layout.replace(/region=\"([a-zA-Z]+?)\"([^>]*)>[^<]*</g, function() {
		return 'region="' + arguments[1] + '"' + arguments[2] + '>' + regions[arguments[1]] + '<';
	});
}

var getUser = function(userId) {
	var deferred = Q.defer();
	usersRef.child(userId).once('value', function (snapshot) {
		deferred.resolve(snapshot.val());
	});
	return deferred.promise;
};

var getTodo = function(todoId) {
	var deferred = Q.defer();
	todosRef.child(todoId).once('value', function (snapshot) {
		deferred.resolve(snapshot.val());
	});
	return deferred.promise;
};

var populateChildren = function(item) {
	var deferred = Q.defer();
	Q.all(Object.keys(item.children).map(getTodo))
		.then(function(todos) {
			item.children = todos;
			deferred.resolve(item);
		});
	return deferred.promise;
};

var addTitleText = function(user) {
	user.text = 'Think/Do';
	return user;
};

var getPopulatedUser = function(userId) {
	return getUser(userId).then(populateChildren).then(addTitleText);
};

var getPopulatedTodo = function(userId) {
	return getTodo(userId).then(populateChildren);
};

var composeHtml = function(todo, layout, toolbarTpl, listTpl) {
	console.log(todo);
	var toolbar = stitch({
		app: app,
		todo: todo
	}, toolbarTpl);
	var list = stitch({
		app: app,
		todo: todo
	}, listTpl);
	return flood(layout, {
		toolbar: toolbar,
		content: list
	});
};

var getHtmlFor = function(getCurrentTargetPromise) {
	return Q.all([
		getCurrentTargetPromise,
		layout,
		toolbar,
		list
	]).spread(composeHtml);
};

// templates
var layout = readFile(__dirname + '/views/index.tck', "utf-8");
var toolbar = readFile(path.resolve(__dirname + '/../client/mods/toolbar/toolbar.hb'), 'utf-8');
var list = readFile(path.resolve(__dirname + '/../client/mods/list/list.hb'), 'utf-8');

function setupServer(name, port, directory, built) {

	// setup
	var server = express();
	server.use(express.static(directory));

	// web
	server.get('/', function(req, res) {
		getHtmlFor(getPopulatedUser('u0')).then(function(html) {
			res.send(html);
		});
	});
	server.get('/:id', function(req, res) {
		if(req.params.id === 'favicon.ico') return;
		getHtmlFor(getPopulatedTodo(req.params.id)).then(function(html) {
			res.send(html);
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
