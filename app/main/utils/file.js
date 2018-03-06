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

module.exports = { open, update };
