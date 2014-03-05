var express = require('express'),
    exphbs = require('express3-handlebars'),
    path = require('path'),
    builtDir = path.resolve(__dirname + '/../www'),
    devDir = path.resolve(__dirname + '/../client');

function setupServer(name, port, directory, dev) {
	var server = express().use(express.static(directory));
	server.engine('hbs', exphbs({extname: '.hbs'}));
	server.set('view engine', 'hbs');
	server.set('views', path.resolve(__dirname + '/views'));
	server.get('/', function(req, res) {
		res.render('index', {
			id: 0,
			dev: dev
		});
	});
	server.get('/:id', function(req, res) {
		res.render('index', {
			id: req.params.id,
			dev: dev
		});
	});
	server.listen(port);
	console.log(name+" server started on http://localhost:"+port+"/");
	return server;
}

var built = setupServer("Built", 8080, builtDir, false);

// serve development code when not in production
if(!process.env.SUBDOMAIN) {
	var dev = setupServer("Development", 8081, devDir, true);
}