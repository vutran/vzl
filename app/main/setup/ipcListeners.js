const { ipcMain } = require('electron');
const file = require('../utils/file');

module.exports = (app, appState) => {
  ipcMain.on('update', (evt, source) => {
    try {
      file.update(source, app, appState);
    } catch (err) {}
  });

  ipcMain.on('open', (evt, filename) => {
    file.open(filename, app, appState);
  });
};
