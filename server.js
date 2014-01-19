// var connect = require('connect'),
// 	http = require('http'),
//     localDir = 'www',
//     builtDir = 'dist';

// var built = connect()
// 	.use(connect.logger('dev'))
// 	.use(connect.static(builtDir))
// 	.use(connect.directory(builtDir));
// http.createServer(built).listen(8080);

// if(!process.env.subdomain) {

// 	var dev = connect()
// 		.use(connect.logger('dev'))
// 		.use(connect.static(localDir))
// 		.use(connect.directory(localDir));
// 	http.createServer(dev).listen(8081);

// }

// requires node's http module
var http = require('http');

// creates a new httpServer instance
http.createServer(function (req, res) {
  // this is the callback, or request handler for the httpServer

  // respond to the browser, write some headers so the 
  // browser knows what type of content we are sending
  res.writeHead(200, {'Content-Type': 'text/html'});

  // write some content to the browser that your user will see
  res.write('<h1>hello, i know nodejitsu.</h1>');

  // close the response
  res.end();
}).listen(8080); // the server will listen on port 8080