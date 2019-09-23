// 后端API入口

// var http = require('http');
// var url = require('url');
var axios = require('axios');
var app = require('express')();
var querystring = require('querystring');
// var cors = require('cors');
// var http = require('http').Server(app);
// var oauth = require('./oauth.js');
// var token = require('./token.js');
var config = require('./config.js');

// allow custom header and CORS
// app.use(cors());
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
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
    config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
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
    // 附注，此处可以拿到用户的access_token，可以储存以使用其他API
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

// http.listen(config.SERVER_PORT, function () {
//   console.log(`Server listening on ${config.SERVER_PORT}`);
// });

app.listen(config.SERVER_PORT, function () {
  console.log(`Server listening on ${config.SERVER_PORT}`);
});

