const Viz = require('viz.js');
const { ipcMain } = require('electron');

module.exports = (app, appState) => {
  ipcMain.on('editor', (evt, msg) => {
    try {
      appState.currentSource = msg;
      appState.svg = Viz(appState.currentSource);
      evt.sender.send('preview', appState.svg);
    } catch (err) {}
  });
};
