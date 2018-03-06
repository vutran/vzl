const { ipcRenderer } = require('electron');
const Viz = require('viz.js');

// global import
require('ace-builds');
require('ace-builds/src/mode-dot.js');

const editor = ace.edit('editor', {
    mode: 'ace/mode/dot',
    showFoldWidgets: false,
    showLineNumbers: false,
});
const preview = document.getElementById('preview');

editor.getSession().on('change', (delta) => {
    const src = editor.getSession().getDocument().getValue();
    ipcRenderer.send('editor', src);
});

// initial render
document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('editor', editor.getSession().getDocument().getValue());
});

ipcRenderer.on('preview', (evt, msg) => {
    preview.innerHTML = msg;
});
