const fs = require('fs');
const path = require('path');


module.exports = {
    saveConfig: function (mod) {
        fs.writeFile("./data/config.json", mod, 'utf8', (err) => {
        });
    },
    readConfig: function (callback) {
        const folder = './data/'; //保存至目录下的file文件夹
        /* 如果文件夹不存在则创建 */
        try {
            fs.readFile(`${folder}config.json`, 'utf8', function (err, data) {
                if (err) {
                    fs.mkdir(folder, function (err) {

                        let content = {
                            type: 'zoomOt',
                            autoStart: false,
                            size: 1,
                            zoom: '100%'
                        }
                        fs.writeFile(`${folder}config.json`, JSON.stringify(content), 'utf8', (err) => {
                            if (err) throw err
                            callback && callback(JSON.stringify(content))

                        });
                    });
                } else
                    callback && callback(JSON.stringify(data))

            })

        } catch (e) {

        }
    }
}