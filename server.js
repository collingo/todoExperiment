var express = require('express'),
    exphbs = require('express3-handlebars'),
    builtDir = 'www',
    devDir = 'dev';

function setupServer(name, port, directory) {
	var server = express().use(express.static(directory));
	server.engine('hbs', exphbs({extname: '.hbs'}));
	server.set('view engine', 'hbs');
	server.set('views', __dirname + '/' + directory);
	server.get('/', function(req, res) {
		res.render('index', {
			id: 0
		});
	});
	server.get('/:id', function(req, res) {
		res.render('index', {
			id: req.params.id
		});
	});
	server.listen(port);
	console.log(name+" server started on http://localhost:"+port+"/");
	return server;
}

var built = setupServer("Built", 8080, builtDir);

// serve development code when not in production
if(!process.env.subdomain) {

	var dev = setupServer("Local", 8081, devDir);

}
