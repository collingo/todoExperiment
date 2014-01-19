var connect = require('connect'),
    localDir = 'www',
    builtDir = 'dist';

if(process.env.subdomain) {
	connect().use(connect.static(builtDir)).listen(8080);
} else {
	connect().use(connect.static(localDir)).listen(8080);
	connect().use(connect.static(builtDir)).listen(8081);
}