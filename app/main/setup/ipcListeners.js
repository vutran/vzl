const Viz = require('viz.js');
const { ipcMain } = require('electron');
const file = require('../utils/file');

module.exports = (app, appState) => {
  ipcMain.on('update', (evt, source) => {
    try {
      file.update(source, app, appState);

      // sends the new svg preview back to renderer
      appState.svg = Viz(appState.fo.source);
      evt.sender.send('preview', appState.svg);
    } catch (err) {}
  });

  ipcMain.on('open', (evt, filename) => {
    file.open(filename, app, appState);
  });
};
