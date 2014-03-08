var express = require('express'),
    exphbs = require('express3-handlebars'),
    path = require('path'),
    gitrev = require('git-rev'),
    builtDir = path.resolve(__dirname + '/../www'),
    devDir = path.resolve(__dirname + '/../client'),
    rev = false;

function setupServer(name, port, directory, prod, built) {
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
		res.render('index', {
			id: 0,
			built: built,
			rev: rev,
			data: JSON.stringify(require('./data.json'))
		});
	});
	server.get('/:id', function(req, res) {
		res.render('index', {
			id: req.params.id,
			built: built,
			rev: rev,
			data: JSON.stringify(require('./data.json'))
		});
	});
	server.listen(port);
	console.log(name+" server started on http://localhost:"+port+"/");
	return server;
}

(function startServers(prod) {
	var built = setupServer("Built", 8080, builtDir, prod, true);

	// serve development code when not in production
	if(!prod) {
		var dev = setupServer("Development", 8081, devDir, prod, false);
	}
}(!!process.env.SUBDOMAIN));