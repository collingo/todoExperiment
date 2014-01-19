var connect = require('connect'),
	http = require('http'),
    localDir = 'www',
    builtDir = 'dist';

var built = connect()
	.use(connect.logger('dev'))
	.use(connect.static(builtDir))
	.use(connect.directory(builtDir));
http.createServer(built).listen(8080);

if(!process.env.subdomain) {

	var dev = connect()
		.use(connect.logger('dev'))
		.use(connect.static(localDir))
		.use(connect.directory(localDir));
	http.createServer(dev).listen(8081);

}
