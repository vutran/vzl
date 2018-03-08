const fs = require('fs');

function update(source, app, appState) {
  appState.fo.source = source;
}

function open(file, app, appState) {
  appState.fo = {
    file,
    source: fs.readFileSync(file, 'utf8'),
  };

  appState.mainWindow.webContents.send('open', appState.fo);
}

function exportAsSVG(file, app, appState) {
  appState.mainWindow.webContents.send(
    'export-svg',
    Object.assign({}, appState.fo, { file })
  );
}

function exportAsPNG(file, app, appState) {
  appState.mainWindow.webContents.send(
    'export-png',
    Object.assign({}, appState.fo, { file })
  );
}

module.exports = { open, update, exportAsSVG, exportAsPNG };
