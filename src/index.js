const {app, BrowserWindow, Menu, ipcMain, webContents} = require('electron')
require('./tool/application-menu')
let win = null;
const fs = require('fs')
let auto = require('./tool/autoStart')
let configHelper = require('./tool/config');
const path = require('path')
const version = require('./tool/version')
const {autoUpdater} = require("electron-updater");

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
    // win.loadFile('index.html')
    win.webContents.on('did-finish-load', () => {
        //   autoUpdate.checkVersion(win)

    })
}

function updateHandle() {
    autoUpdater.updateConfigPath = path.join(__dirname, 'app-updater.yml')


    function sendUpdateMessage(text) {
        win.webContents.send('downloadProgress', text)
    }

    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };
    const os = require('os');

    autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error)

    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });
    // 更新下载进度事件
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        autoUpdater.quitAndInstall()
        fs.writeFile(path.join(__dirname, '../data/version.json'), JSON.stringify({fitstLogin: true}), 'utf-8', (err) => {
        })
    });
    ipcMain.on('close', () => {
        BrowserWindow.getFocusedWindow().close()
    })
    ipcMain.on('update', (event, arg) => {
        autoUpdater.checkForUpdates()
        autoUpdater.on('download-progress', function (progressObj) {
            console.log(JSON.stringify(progressObj))
            event.sender.send('downloadProgress', progressObj)
        })
        autoUpdater.on('update-not-available', function (info) {
            event.sender.send('downloadProgress', 'no')
        });
    })
}


// 通过main进程发送事件给renderer进程，提示更新信息


function saveConfig() {

    configHelper.saveConfig();

}

ipcMain.on('send-message-A', (event, arg) => {

    let options = JSON.parse(arg)
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
    } else if (options.type === 'video') {
    } else if (options.type === 'open') {

    } else
        win.webContents.openDevTools()

});


//server.createServer()
updateHandle()

app.on('ready', createWindow)