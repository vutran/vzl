const path = require('path');
const url = require('url');
const { BrowserWindow } = require('electron');

module.exports = (app, appState) => {
  appState.mainWindow = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    textAreasAreResizable: false,
  });

  appState.mainWindow.on('closed', () => {
    appState.mainWindow = null;
    app.quit();
  });

  const pathname = path.resolve(
    __dirname,
    '..',
    '..',
    'renderer',
    'index.html'
  );

  appState.mainWindow.loadURL(
    url.format({
      pathname,
      protocol: 'file:',
      slashes: true,
    })
  );
};
