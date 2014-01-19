var connect = require('connect'),
    localDir = 'www',
    builtDir = 'dist';

if(process.env.subdomain) {
	connect().use(connect.static(__dirname + '/' + builtDir)).listen(8080);
} else {
	connect().use(connect.static(__dirname + '/' + localDir)).listen(8080);
	connect().use(connect.static(__dirname + '/' + builtDir)).listen(8081);
}