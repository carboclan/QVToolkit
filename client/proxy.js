var PORT = 80;
  
var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
  target: 'http://127.0.0.1:8000/'
  // 下面的设置用于https
  // ssl: {
  //     key: fs.readFileSync('server_decrypt.key', 'utf8'),
  //     cert: fs.readFileSync('server.crt', 'utf8')
  // },
  // secure: false
});

proxy.on('error', function(err, req, res) {
  res.writeHead(500, {
    'content-type': 'text/plain'
  });
  console.log(err);
  res.end('Something went wrong. And we are reporting a custom error message.');
});

var server = http.createServer(function(req, res) {
  var hostname = req.headers.host;
  res.oldWriteHead = res.writeHead;
  res.writeHead = function(statusCode, headers) {
    /* add logic to change headers here */
    const ref = req.headers.referer
    // res.setHeader('Access-Control-Allow-Origin', ref ? ref.substr(0, req.headers.referer.length - 1) : '');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization,token, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    // res.setHeader("Content-Type", "application/json;charset=utf-8");
    res.oldWriteHead(statusCode, headers);
  };
  var method = req.method;
  // OPTIONS请求直接返回成功
  if (method == 'OPTIONS') {
    res.writeHead(200, {
      'content-type': 'text/plain'
    });
    res.end('{"test": "options ok"}');
    return;
  }
  console.log(req.url)
  proxy.web(req, res);
  return;
});

server.on('upgrade', function(req, socket, head) {
  proxy.ws(req, socket, head);
});

server.listen(PORT);
console.log('Server runing at port: ' + PORT + '.');
