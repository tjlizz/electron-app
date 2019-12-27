let fs = require('fs')
let express = require('express');
let app = express();
let bodyParser = require("body-parser")
let configTool = require('./tool/config')
app.use(express.json())
const path = require('path')
const cors = require('cors')
var net = require('net')
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './pipelineout')));
 
 



function probe(port, callback) {

    let server = net.createServer().listen(port)

    var calledOnce = false

    var timeoutRef = setTimeout(function () {
        calledOnce = true
        callback(false, port)
    }, 2000)

    timeoutRef.unref()

    var connected = false

    server.on('listening', function () {
        clearTimeout(timeoutRef)

        if (server)
            server.close()

        if (!calledOnce) {
            calledOnce = true
            callback(true, port)
        }
    })

    server.on('error', function (err) {
        clearTimeout(timeoutRef)

        var result = true
        if (err.code === 'EADDRINUSE')
            result = false

        if (!calledOnce) {
            calledOnce = true
            callback(result, port)
        }
    })
}

function createServer(_port, callback) {
    var pt = _port || 8888;
    probe(pt, function (bl, _pt) {
        // 端口被占用 bl 返回false
        // _pt：传入的端口号
        if (bl === true) {
            // ssr(_pt)
            app.listen(pt)
            callback && callback(pt)


        } else {
            createServer(_pt + 1, callback)
        }
    })
}




module.exports = {


    createServer: (port, callback) => createServer(port, callback)
}

