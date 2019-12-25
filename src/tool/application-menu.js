const { app, Menu, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater");
const ipcRenderer = require('electron').ipcRenderer;
const path = require('path')
const version = require('./version')
const dialog = require('electron').dialog
const template = [{
    role: 'help',
    label: '帮助',
    submenu: [
        {
            label: '设置qq',
            click: async (item, focusedWindow) => {
                let newWin = new BrowserWindow({
                    width: 450,
                    title: '这是一个设置页面',
                    height: 600,
                    parent: focusedWindow,
                    // autoHideMenuBar: true,
                    id: 'new',
                    modal: true,
                    frame: true,
                    webPreferences: {
                        nodeIntegration: true
                    }
                })
                newWin.webContents.openDevTools()

                newWin.loadFile(path.join(__dirname, '../view/config.html'))
            }
        }, {
            label: '更新',
            click: (item, focusedWindow) => {

                version.check((data => {
                    data = JSON.parse(data)
                    if (data.version === app.getVersion()) {
                        const options = {
                            type: 'info',
                            title: '提示',
                            message: "当前系统已经是最新版本",
                            buttons: ['好的']
                        }
                        dialog.showMessageBox(options)
                    } else {
                        let newWin = new BrowserWindow({
                            width: 450,
                            title: '版本更新',
                            height: 100,
                            parent: focusedWindow,
                            autoHideMenuBar: true,
                            id: 'new',
                            frame: false,
                            resizable: false,
                            modal: true,
                            webPreferences: {
                                nodeIntegration: true
                            }
                        })
                        newWin.webContents.openDevTools()

                        newWin.loadFile(path.join(__dirname, '../view/version.html'))

                        newWin.on("close", () => {
                            newWin = null
                        })
                    }


                }))



                // autoUpdater.checkForUpdates('')

            }
        }, {
            label: '更新记录',
            click: () => {
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
            }
        }, {
            label: '放大',
            visible: false,
            role: 'zoomIn',
            id: 'zoomIn'
        }
    ]
}]


app.on('ready', () => {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})