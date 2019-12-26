let http = require('http')
let fs = require('fs')
let url = require('url')
let configTool = require('./tool/config')
let querystring = require('querystring');
let util = require('util');

let appServer = http.createServer(async function (request, response) {
    let parsedUrl = url.parse(request.url, true)
    let pathWithQuery = request.url
    let queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }
    let path = parsedUrl.pathname
    let query = parsedUrl.query
    let method = request.method
    console.log(method)
    if (path === '/') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write('哈哈哈')
        response.end()
    } else if (path === "/read") {
        configTool.readConfig(data => {
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/json;charset=utf-8')
            response.write(data)
            response.end()
        })

    } else if (method === 'POST' && path === '/save') {
        let postData = '';
        // 18. 给req对象注册一个接收数据的事件
        request.on('data', function (chuck) {
            postData += chuck;
        })
        request.on('end', function () {
            configTool.saveConfig(postData)
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/json;charset=utf-8')
            response.write('true')
            response.end()

        })

    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write('呜呜呜')
        response.end()
    }

})
appServer.listen(8888)
