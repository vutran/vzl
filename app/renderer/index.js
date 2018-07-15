// todo(vutran) - move to React or some alternative templating engine
const path = require('path');
const { ipcRenderer } = require('electron');
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render');
const debounce = require('debounce');

// global import
require('ace-builds');
require('ace-builds/src-noconflict/mode-dot.js');

let viz = new Viz({ Module, render });
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
  viz
    .renderString(val)
    .then(result => {
      preview.innerHTML = result;
    })
    .catch(err => {
      // creates a new Viz instance
      // ref: https://github.com/mdaines/viz.js/wiki/Caveats#rendering-graphs-with-user-input
      viz = new Viz({ Module, render });
    });
}

function renderViz() {
  const val = getValue();
  ipcRenderer.send('update', val);
  updatePreview(val);
}

editor.getSession().on('change', debounce(renderViz, 200));

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
document.addEventListener('DOMContentLoaded', renderViz);
