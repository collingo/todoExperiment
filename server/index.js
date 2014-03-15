var express = require('express');
var exphbs = require('express3-handlebars');
var path = require('path');
var gitrev = require('git-rev');
var mongo = require('mongodb');

var builtDir = path.resolve(__dirname + '/../www');
var devDir = path.resolve(__dirname + '/../client');
var rev = false;
var dbConnection = process.env.SUBDOMAIN ?
	'mongodb://nodejitsu:28dac1b222ea09a3acd4e571893893e2@troup.mongohq.com:10042/nodejitsudb353559255' :
	'mongodb://127.0.0.1:27017/thinkDo';

function setupServer(name, port, directory, built, todosCollection) {
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
	server.engine('hbs', exphbs({extname: '.hbs'}));
	server.set('view engine', 'hbs');
	server.set('views', path.resolve(__dirname + '/views'));
	server.get('/', function(req, res) {
		todosCollection.find().toArray(function(err, data) {
			res.render('index', {
				id: 0,
				built: built,
				rev: rev,
				data: JSON.stringify(data)
			});
		});
	});
	server.get('/:id', function(req, res) {
		todosCollection.find().toArray(function(err, data) {
			res.render('index', {
				id: req.params.id,
				built: built,
				rev: rev,
				data: JSON.stringify(data)
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
	if(!process.env.SUBDOMAIN) {
		var dev = setupServer("Development", 8081, devDir, false, todosCollection);
	}
};

mongo.connect(dbConnection, function(err, db) {
	if(err) throw err;
	startServers(db.collection('todos'));
});
