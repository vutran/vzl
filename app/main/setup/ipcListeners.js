const Viz = require('viz.js');
const { ipcMain } = require('electron');
const file = require('../utils/file');

module.exports = (app, appState) => {
  ipcMain.on('update', (evt, fo) => {
    try {
      file.update(fo.file, fo.source, app, appState);

      // sends the new svg preview back to renderer
      appState.svg = Viz(appState.currentSource);
      evt.sender.send('preview', appState.svg);
    } catch (err) {}
  });

  ipcMain.on('open', (evt, filename) => {
    file.open(filename, app, appState);
  });
};
