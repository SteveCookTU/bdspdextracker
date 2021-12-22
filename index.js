const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require("path")
const fs = require("fs")

const imagesDir = './images'
if(!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir)
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    })
    //win.removeMenu()
    win.loadFile('index.html').then(() => console.log("index.html loaded"))

}

ipcMain.on("pokeDivClick", function(event, args) {
    const win = BrowserWindow.fromId(event.frameId)
    win.loadURL(`file://${__dirname}/details.html?num=${args}`).then(() => console.log("details.html loaded"))
})

ipcMain.on("checkComplete", function (event, args) {
    const win = BrowserWindow.fromId(event.frameId)
    const exists = fs.existsSync(imagesDir + "/" + args + ".jpg")
    win.webContents.send("isComplete", [args, exists])
})

ipcMain.on("returnHome", function (event, args) {
    const win = BrowserWindow.fromId(event.frameId)
    win.loadFile('index.html').then(() => console.log("index.html loaded"))
})

ipcMain.on("getPath", function (event, args) {
    const win = BrowserWindow.fromId(event.frameId)
    win.webContents.send("initPath", path.resolve(imagesDir.concat("/").concat(args).concat(".jpg")))
})

ipcMain.on("addImageClick", function (event, args) {
    const win = BrowserWindow.fromId(event.frameId)
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: "Images", extensions: ["jpg"] }
        ]
    }).then(result => {
        if(!result.canceled) {
            fs.copyFileSync(result.filePaths[0], imagesDir.concat("/").concat(args).concat(".jpg"))
            win.webContents.send("reloadImage", path.resolve(imagesDir.concat("/").concat(args).concat(".jpg")))
        }
    }).catch(err => {
        console.log(err)
    })
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})