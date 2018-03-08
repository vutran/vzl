// todo(vutran) - move to React or some alternative templating engine
const path = require('path');
const { ipcRenderer } = require('electron');
const Viz = require('viz.js');
const debounce = require('debounce');

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

function updatePreview(val) {
  try {
    const svg = Viz(val);
    preview.innerHTML = svg;
  } catch (err) {}
}

function render() {
  const val = getValue();
  ipcRenderer.send('update', val);
  updatePreview(val);
}

editor.getSession().on('change', debounce(render, 200));

ipcRenderer.on('open', (evt, fo) => {
  title.innerHTML = fo.file;
  editor.getSession().setValue(fo.source);
});

ipcRenderer.on('export-svg', (evt, fo) => {
  try {
    const svg = Viz(fo.source);
    evt.sender.send('export', {
      file: fo.file,
      type: 'svg',
      data: svg,
    });
  } catch (err) {}
});

ipcRenderer.on('export-png', (evt, fo) => {
  try {
    const svg = Viz(fo.source);
    Viz.svgXmlToPngBase64(svg, 1, (err, data) => {
      evt.sender.send('export', {
        file: fo.file,
        type: 'png',
        data,
      });
    });
  } catch (err) {}
});

// initial render
document.addEventListener('DOMContentLoaded', render);
