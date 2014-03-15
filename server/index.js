var express = require('express');
var exphbs = require('express3-handlebars');
var path = require('path');
var gitrev = require('git-rev');
var mongo = require('mongodb');
var _ = require('underscore');

var builtDir = path.resolve(__dirname + '/../www');
var devDir = path.resolve(__dirname + '/../client');
var rev = false;
var isDev = !process.env.SUBDOMAIN;
var dbConnection = !isDev ?
	'mongodb://nodejitsu:28dac1b222ea09a3acd4e571893893e2@troup.mongohq.com:10042/nodejitsudb353559255' :
	'mongodb://127.0.0.1:27017/thinkDo';

function setupServer(name, port, directory, built, todosCollection) {
	var server = express();
	server.use(express.static(directory));
	server.configure(function() {
		server.use(express.urlencoded());
		server.use(express.json());
	});
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
	server.engine('hbs', exphbs({extname: '.hbs'}));
	server.set('view engine', 'hbs');
	server.set('views', path.resolve(__dirname + '/views'));
	server.get('/', function(req, res) {
		todosCollection.find().toArray(function(err, data) {
			if(err) throw err;
			res.render('index', {
				id: "",
				built: built,
				rev: rev,
				data: JSON.stringify(data)
			});
		});
	});
	server.get('/:id', function(req, res) {
		todosCollection.find().toArray(function(err, data) {
			if(err) throw err;
			res.render('index', {
				id: req.params.id,
				built: built,
				rev: rev,
				data: JSON.stringify(data)
			});
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
	server.listen(port);
	console.log(name+" server started on http://localhost:"+port+"/");
	return server;
}

function startServers(todosCollection) {
	var built = setupServer("Built", 8080, builtDir, true, todosCollection);

	// serve development code when not in production
	if(isDev) {
		var dev = setupServer("Development", 8081, devDir, false, todosCollection);
	}
};

mongo.connect(dbConnection, function(err, db) {
	if(err) throw err;
	startServers(db.collection('todos'));
});
