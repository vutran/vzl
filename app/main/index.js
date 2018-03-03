const path = require('path');
const url = require('url');
const Viz = require('viz.js');
const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow = null;

ipcMain.on('editor', (evt, msg) => {
    try {
        const svg = Viz(msg);
        evt.sender.send('preview', svg);
    } catch (err) { console.error(err); }
});

function createWindow() {
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hiddenInset',
        textAreasAreResizable: false,

    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const pathname = path.resolve(__dirname, '..', 'renderer', 'index.html');

    mainWindow.loadURL(url.format({
        pathname,
        protocol: 'file:',
        slashes: true,
    }));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
