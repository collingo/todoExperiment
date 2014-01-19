// var connect = require('connect'),
//     staticDir = 'www',
//     builtDir = 'dist';

// connect().use(connect.static(staticDir)).listen(8080);
// connect().use(connect.static(builtDir)).listen(9090);

// requires node's http module
var http = require('http');

// creates a new httpServer instance
http.createServer(function (req, res) {
	// this is the callback, or request handler for the httpServer

	// respond to the browser, write some headers so the 
	// browser knows what type of content we are sending
	res.writeHead(200, {'Content-Type': 'text/html'});

	// write some content to the browser that your user will see
	res.write('<h1>hello, i know nodejitsu and how to deploy via github hooks.</h1>');

	// close the response
	res.end();
}).listen(8080); // the server will listen on port 8080