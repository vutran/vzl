const fs = require('fs');
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

  ipcMain.on('export', (evt, { file, type, data }) => {
    switch (type) {
      case 'svg':
        fs.writeFile(file, data, 'utf8');
        break;
      case 'png':
        fs.writeFile(file, data, 'base64');
    }
  });
};
