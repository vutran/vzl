const Viz = require('viz.js');
const { ipcMain } = require('electron');
const file = require('../utils/file');

module.exports = (app, appState) => {
  ipcMain.on('editor', (evt, msg) => {
    try {
      appState.currentSource = msg;
      appState.svg = Viz(appState.currentSource);
      evt.sender.send('preview', appState.svg);
    } catch (err) {}
  });

  ipcMain.on('open', (evt, filename) => {
    file.open(filename, app, appState);
  });
};
