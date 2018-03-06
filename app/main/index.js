const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
const setupIpcListeners = require('./setup/ipcListeners');
const setupWindow = require('./setup/window');
const setupMenu = require('./setup/menu');

// state lol!
let appState = {
  svg: null, // the currently rendered svg
  mainWindow: null, // the main window instance
  currentSource: null, // the currently opened file source
  currentFile: null, // the currently opened file
};

function createWindow() {
  setupIpcListeners(app, appState);
  setupWindow(app, appState);
  setupMenu(app, appState);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (appState.mainWindow === null) {
    createWindow();
  }
});
