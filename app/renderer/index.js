const { ipcRenderer } = require('electron');

const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// initial render
document.addEventListener('DOMContentLoaded', () => {
    console.log(editor.value);
    ipcRenderer.send('editor', editor.value);
});

editor.addEventListener('keyup', e => {
    ipcRenderer.send('editor', e.target.value);
});

ipcRenderer.on('preview', (evt, msg) => {
    preview.innerHTML = msg;
});
