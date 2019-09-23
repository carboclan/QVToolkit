//

// var http = require('http');
// var url = require('url');
var axios = require('axios');
var app = require('express')();
var querystring = require('querystring');
var http = require('http').Server(app);
// var oauth = require('./oauth.js');
// var token = require('./token.js');
var config = require('./config.js');

//allow custom header and CORS
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.sendStatus(204);
  }
  else {
    next();
  }
});

app.get('/', function (req, res) {
  return res.json({code: 0, msg: 'home page'});
});

app.get('/login/verify', function(req, res) {
  var code = req.query.code;
  var result = null;
  if (!code) {
    return res.json({code: 1, msg: 'verify code required'});
  }
  axios({
    method: 'POST',
    url: 'https://github.com/login/oauth/access_token',
    data: {
      // 需要带上这些信息去请求
      client_id: config.GITHUB_CLIENT_ID,
      client_secret: config.GITHUB_CLIENT_SECRET,
      code: code
    }
  }).then(function(response) {
    // 处理下返回
    console.log(response.data);
    result = querystring.parse(response.data);
    console.log(result);
    // 没有错误发生， 成功
    if (typeof(result.error) === "undefined") {
      return res.json({code: 0});
    // 失败的
    } else {
      return res.json({code: 1, msg: result.error});
    }
  }).catch(function(error) {
    console.log(error);
    res.json({code: 2});
  });
})

http.listen(config.SERVER_PORT, function () {
  console.log(`Server listening on ${config.SERVER_PORT}`);
});

// var server = http.createServer(function (req, res) {
//   // Allow CORS
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT');
//   res.setHeader('Access-Control-Allow-Headers', '*');
//    if ( req.method === 'OPTIONS' ) {
//     res.writeHead(204);
//     res.end();
//     return;
//   }

//   const pureURL = url.parse(req.url);
//   console.log(pureURL.pathname);
//   var queryData = {};
//   if ('/' === pureURL.pathname) {
//     res.statusCode = 200;
//     res.write('<p><a href="/">Nothing</a></p>' +
//               '<p><a href="/">Nothing</a></p>');
//     return res.end();
//   }
//   // 验证github登录的code
//   else if ('/login/verify' === pureURL.pathname) {
//     queryData = querystring.parse(pureURL.query);
//     let result = null;
//     console.log(queryData);
//     axios({
//       method: 'POST',
//       url: 'https://github.com/login/oauth/access_token',
//       data: {
//         // 需要带上这些信息去请求
//         client_id: config.GITHUB_CLIENT_ID,
//         client_secret: config.GITHUB_CLIENT_SECRET,
//         code: queryData.code
//       }
//     }).then(function(response) {
//       // 处理下返回
//       console.log(response.data);
//       result = querystring.parse(response.data);
//       console.log(result);
//       // 没有错误发生， 成功
//       if (typeof(result.error) === "undefined") {
//         res.write(`{code: 0}`);
//         return res.end();
//       // 失败的
//       } else {
//         res.write(`{code: 1, msg: ${result.error}}`);
//         return res.end();
//       }
//     }).catch(function(error) {
//       console.log(error);
//       res.write(`{code: 2}`);
//       return res.end();
//     });
//   }
//   else {
//     res.write('<p>Bad location</p>');
//     return res.end();
//   }
// });

// server.listen(8000);
