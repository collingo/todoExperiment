var express = require('express'),
    exphbs = require('express3-handlebars'),
    path = require('path'),
    builtDir = path.resolve(__dirname + '/../www'),
    devDir = path.resolve(__dirname + '/../client');

function setupServer(name, port, directory, rev, built) {
	var server = express().use(express.static(directory));
	server.engine('hbs', exphbs({extname: '.hbs'}));
	server.set('view engine', 'hbs');
	server.set('views', path.resolve(__dirname + '/views'));
	server.get('/', function(req, res) {
		res.render('index', {
			id: 0,
			built: built,
			rev: rev
		});
	});
	server.get('/:id', function(req, res) {
		res.render('index', {
			id: req.params.id,
			built: built,
			rev: rev
		});
	});
	server.listen(port);
	console.log(name+" server started on http://localhost:"+port+"/");
	return server;
}

function startServers(rev) {
	var built = setupServer("Built", 8080, builtDir, rev, true);

	// serve development code when not in production
	if(rev) {
		var dev = setupServer("Development", 8081, devDir, rev, false);
	}
}

if(process.env.SUBDOMAIN) {
	startServers();
} else {
	var gitrev = require('git-rev');
	gitrev.short(startServers);
}