const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 130,
    height: 160,
    resizable: false,
    frame: false,
    transparent: true,
    icon: './src/assets/bye_icon_155703.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: './src/preload.js'
    }
  })
  // win.webContents.openDevTools()
  win.loadFile('./src/index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('err', (evt, arg) => {
  dialog.showErrorBox('err', arg)
  evt.returnValue = 'ok'
})
