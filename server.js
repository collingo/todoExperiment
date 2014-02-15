var express = require('express'),
	handlebars = require('handlebars'),
    localDir = 'dev',
    builtDir = 'www';

var built = express()
	.use(express.static(builtDir));
var builtIndex = require('./www/index.hbs');
built.get('/', function(req, res){
	var body = builtIndex({id:0});
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(body));
	res.end(body);
});
built.get('/:id', function(req, res){
	var body = builtIndex({id:req.params.id});
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(body));
	res.end(body);
});
built.listen(8080);
console.log("Built distribution server started on http://localhost:8080/");

// serve development code when not in production
if(!process.env.subdomain) {

	var dev = express()
		.use(express.static(localDir));
	var devIndex = require('./dev/index.hbs');
	dev.get('/', function(req, res){
		var body = devIndex({id:0});
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', Buffer.byteLength(body));
		res.end(body);
	});
	dev.get('/:id', function(req, res){
		var body = devIndex({id:req.params.id});
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', Buffer.byteLength(body));
		res.end(body);
	});
	dev.listen(8081);
	console.log("Local development server started on http://localhost:8081/");

}
