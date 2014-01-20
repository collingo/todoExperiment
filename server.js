var connect = require('connect'),
	http = require('http'),
    localDir = 'dev',
    builtDir = 'www';

// serve built code
var built = connect()
	// .use(connect.logger('dev'))
	.use(connect.static(builtDir))
	.use(connect.directory(builtDir));
http.createServer(built).listen(8080);
console.log("Built distribution server started on http://localhost:8080/");

// serve development code when not in production
if(!process.env.subdomain) {

	var dev = connect()
		// .use(connect.logger('dev'))
		.use(connect.static(localDir))
		.use(connect.directory(localDir));
	http.createServer(dev).listen(8081);
	console.log("Local development server started on http://localhost:8081/");

}