const axios = require('axios')
const { BrowserWindow } = require('electron')
const dialog = require('electron').dialog
const fs = require('fs')
const path = require('path')
module.exports = {
    check: (callback) => {
        axios.get('http://localhost:3000/api/checkversion').then(data => {
            callback && callback(data.data)

        })
    },
    isFirstLogin: () => {
        fs.readFile(path.join(__dirname, '../../data/version.json'), 'utf-8', (err, data) => {
            if (err) return;
            let mod = JSON.parse(data)
            if (mod.fitstLogin) {
                let newWin = new BrowserWindow({
                    title: '版本更新',
                    autoHideMenuBar: true,
                    id: 'new',
                    frame: true,
                    webPreferences: {
                        nodeIntegration: true
                    }
                })
                newWin.loadFile(path.join(__dirname, '../view/versionList.html'))
                newWin.webContents.openDevTools()
                newWin.on("close", () => {
                    fs.writeFile(path.join(__dirname, '../../data/version.json'), JSON.stringify({ fitstLogin: false }), 'utf-8', (err) => { })
                })
            }
        })
    }
}

