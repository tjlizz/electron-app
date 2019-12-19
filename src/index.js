const {app, BrowserWindow, Menu, ipcMain, webContents} = require('electron')
let win = null;
let auto = require('./tool/auto')
let configHelper = require('./tool/config');
var exec = require('child_process').execFile;
let server = require('./serve')
const path = require('path')
var fun = function (path) {
    console.log(path)
    exec(path, function (err, data) {
        console.log(err)
        console.log(data.toString());
    });
}

function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        fullscreen: false,
        id: 'main',

        webPreferences: {
            webviewTag: true,
            nodeIntegration: true
        }
    })
    // 加载index.html文件
    win.loadURL('https://www.dogedoge.com/')
    //win.loadFile('index.html')
    loadMenu()
    win.webContents.on('did-finish-load', function () {
        //win.webContents.insertCSS('html, body { background-color: #f00; }')
    })
}

//初始化工具栏
function loadMenu() {
    const isMac = process.platform === 'darwin'
    const template = [{
        role: 'help',
        label: '帮助',
        submenu: [
            {
                label: '设置',
                click: async () => {
                    openNew()
                }
            }, {
                label: '清除缓存',
                role: 'forcereload'
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

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function openNew() {

    let newWin = new BrowserWindow({
        width: 450,
        title: '这是一个设置页面',
        height: 600,
        parent: win,
        autoHideMenuBar: true,
        id: 'new',
        modal: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
  //  newWin.webContents.openDevTools()
    console.log(path.join(__dirname, 'config.html'))
    newWin.loadFile(path.join(__dirname, 'view/config.html'))
}

function saveConfig() {

    configHelper.saveConfig();

}

ipcMain.on('send-message-A', (event, arg) => {

    let options = JSON.parse(arg)
    console.log(options)
    if (options.type === 'zoomIn') {
        webContents.getAllWebContents().forEach(element => {
            if (element.browserWindowOptions)
                if (element.browserWindowOptions.id === 'main') {
                    let size = parseInt(options.zoom.substr(0, options.zoom.length - 1))

                    size = (size - 100) / 10
                    console.log(size)
                    element.setZoomLevel(size)
                }
        })
    } else if (options.type === 'zoomOut') {
        webContents.getAllWebContents().forEach(element => {
            if (element.browserWindowOptions)
                if (element.browserWindowOptions.id === 'main') {
                    let size = parseInt(options.zoom.substr(0, options.zoom.length - 1))
                    size = (size - 100) / 10
                    console.log(size)

                    element.setZoomLevel(size)

                }
        })
    } else if (options.type === 'clear') {
        win.webContents.reloadIgnoringCache()
    } else if (arg === 'fun') fun();
    else if (options.type === 'size') {
        let size = 12;
        if (options.size === '2')
            size = 30
        else if (options.size === '3')
            size = 50
        win.webContents.insertCSS(` body {  font-size:${size}px !important }`)
    } else if (options.type === 'autoStart') {

        if (options.autoStart)
            auto.setAppStart()
        else auto.cancelAppStart()

    } else if (arg === 'start')
        saveConfig()

    else if (options.type === 'open') {
        fun(options.fileOpen)

    } else
        win.webContents.openDevTools()

});

server.createServer()
// app.setLoginItemSettings({
//     openAtLogin: true,

// })
app.on('ready', createWindow)