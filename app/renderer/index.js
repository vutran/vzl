// todo(vutran) - move to React or some alternative templating engine
const path = require('path');
const { ipcRenderer } = require('electron');

// global import
require('ace-builds');
require('ace-builds/src/mode-dot.js');

const editor = ace.edit('editor', {
  mode: 'ace/mode/dot',
  showFoldWidgets: false,
  showLineNumbers: false,
});
const title = document.getElementById('title');
const preview = document.getElementById('preview');

function getValue() {
  return editor
    .getSession()
    .getDocument()
    .getValue();
}

editor.getSession().on('change', () => {
  ipcRenderer.send('update', getValue());
});

ipcRenderer.on('preview', (evt, contents) => {
  preview.innerHTML = contents;
});

ipcRenderer.on('open', (evt, fo) => {
  title.innerHTML = fo.file;
  editor.getSession().setValue(fo.source);
});

// initial render
document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('update', getValue());
});
