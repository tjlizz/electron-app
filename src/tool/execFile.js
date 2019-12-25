
 //调用本地文件

const exec = require('child_process').execFile;
var fun = function (path) {
    exec(path, function (err, data) {

    });
}

module.exports = {
    exec: (path) => fun(path)
}