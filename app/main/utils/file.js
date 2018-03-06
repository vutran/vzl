const path = require('path');
const fs = require('fs');
const { dialog } = require('electron');

function hasFile(file, list) {
  for (fo of list) {
    if (fo.file === file) {
      return true;
    }
  }
  return false;
}

function getFile(file, list) {
  for (fo of list) {
    if (fo.file === file) {
      return fo;
    }
  }
}

function update(file, source, app, appState) {
  let fo = null;

  if (hasFile(file, appState.openedFiles)) {
    fo = getFile(file, appState.openedFiles);

    // updates the source for the found file
    fo.source = source;

    appState.currentSource = fo.source;
  }
}

function open(file, app, appState) {
  let fo = null;

  // retrieve from memory if already loaded,
  if (hasFile(file, appState.openedFiles)) {
    fo = getFile(file, appState.openedFiles);
  } else {
    // otherwise read the file and
    // append it to memory
    fo = {
      file,
      source: fs.readFileSync(file, 'utf8'),
    };
    appState.openedFiles.push(fo);
  }

  // set currently active file/source
  appState.currentFile = fo.file;
  appState.currentSource = fo.source;

  appState.mainWindow.webContents.send(
    'set-opened-files',
    appState.openedFiles
  );
  appState.mainWindow.webContents.send('open', fo);
}

function close(file, app, appState) {
  // clear currently active file/source
  appState.currentFile = null;
  appState.currentSource = null;

  // todo(vutran) - open next active file in appState.openedFiles

  appState.mainWindow.webContents.send('close');
}

module.exports = { open, close, update };
