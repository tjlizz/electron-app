const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

const {app, BrowserWindow, Menu, ipcMain, webContents} = require('electron')

let mainWindow = null
// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = 'info';
// log.info('App starting...');

function sendStatusToWindow(progressObj) {

    BrowserWindow.getAllWindows().forEach(element=>{
        if(element.id==='main'){
            element.webContents.send('downloadProgress', progressObj)

        }
    })
}

autoUpdater.on('checking-for-update', () => {
  //  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
 //   sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
 //   sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
   // sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    // console.log(progressObj)
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(progressObj.percent );
})
autoUpdater.on('update-downloaded', (info) => {
    //   sendStatusToWindow('Update downChecking for updateloaded');
});


module.exports = {
    checkVersion(_win) {
        mainWindow = _win
        autoUpdater.checkForUpdates()
    }
}
