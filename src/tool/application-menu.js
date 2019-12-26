const { app, Menu, BrowserWindow, Tray ,nativeImage} = require('electron')
const { autoUpdater } = require("electron-updater");
const ipcRenderer = require('electron').ipcRenderer;
const path = require('path')
const version = require('./version')
const dialog = require('electron').dialog
const isDev = require('electron-is-dev');
const execTool = require('./execFile')
const template = [{
    role: 'help',
    label: '帮助',
    type: 'submenu',
    submenu: [
        {
            label: '设置',
            click: async (item, focusedWindow) => {
                let newWin = new BrowserWindow({
                    width: 450,
                    title: '',
                    height: 600,
                    parent: focusedWindow,
                    autoHideMenuBar: true,
                    id: 'new',
                    modal: true,
                    frame: true,
                    webPreferences: {
                        nodeIntegration: true
                    }
                })
                if (isDev)
                    newWin.webContents.openDevTools()

                newWin.loadFile(path.join(__dirname, '../view/config.html'))
            }
        }, {
            label: '更新',
            visible: false,
            click: (item, focusedWindow) => {

                version.check((data => {
                    data = JSON.parse(data)
                    if (data.version === app.getVersion()) {
                        const options = {
                            type: 'info',
                            title: '提示',
                            message: "当前系统已经是最新版本",
                            buttons: ['确定']
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
                        if (isDev)
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
            visible: false,
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
                if (isDev)
                    newWin.webContents.openDevTools()
            }
        },
        {
            label: '播放',
            visible: true,
            id: 'zoomIn',
            click: () => {
                const url = path.resolve(__dirname, '../../')
                execTool.exec(path.join(url + "/resources/aaa.exe"))

            }
        }, {

            label: '测试',
            visible: isDev,
            click: (item, focusedWindow) => {

                 
                const options = {
                    type: 'question',
                    title: '提示',
                    message: "当前系统已经是最新版本",
                    buttons: ['确定', '取消'],
                    cancelId :1
                }
                dialog.showMessageBox(focusedWindow, options, (response, checkboxChecked) => {
                    console.log(response)
                })
            }
        }
    ]
}]


app.on('ready', () => {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

})