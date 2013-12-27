var connect = require('connect'),
    staticDir = 'www',
    builtDir = 'dist';

connect().use(connect.static(staticDir)).listen(8080);
connect().use(connect.static(builtDir)).listen(9090);
