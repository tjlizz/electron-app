const {app, Menu, BrowserWindow} = require('electron')
const {autoUpdater} = require("electron-updater");
const ipcRenderer = require('electron').ipcRenderer;
const path = require('path')
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
                    frame:true,
                    webPreferences: {
                        nodeIntegration: true
                    }
                })
                newWin.webContents.openDevTools()

                newWin.loadFile(path.join(__dirname, '../view/config.html'))
            }
        }, {
            label: '清除缓存',
            click: (item, focusedWindow) => {

                // autoUpdater.checkForUpdates('')
                let newWin = new BrowserWindow({
                    width: 450,
                    title: '这是一个设置页面',
                    height: 100,
                    parent: focusedWindow,
                   autoHideMenuBar: true,
                    id: 'new',
                    frame:false,
                    resizable:false,
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
        }, {
            label: '刷新',
            role: 'reload'
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