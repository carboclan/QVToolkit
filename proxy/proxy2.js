// https://juejin.im/post/5cbbeaa4f265da0393786641  

//代理
const http = require('http');
const request = require('request');

const hostIp = 'localhost';
const apiPort = 8001;

//创建 API 代理服务
const apiServer = http.createServer((req, res) => {
    console.log('[apiServer]req.url='+req.url);
    const url = 'localhost:8000' + req.url;
    console.log('[apiServer]url='+url);
    const options = {
        url: url
    };

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            //编码类型
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            //允许跨域
            res.setHeader('Access-Control-Allow-Origin', '*');
            //返回代理内容
            res.end(body);
        }
    }

    request.get(options, callback);
});

//监听 API 端口
apiServer.listen(apiPort, hostIp, () => {
    console.log('代理接口，运行于 http://' + hostIp + ':' + apiPort + '/');
});