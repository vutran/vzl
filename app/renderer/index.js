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
const openedFiles = document.getElementById('opened-files');
const preview = document.getElementById('preview');

editor.getSession().on('change', delta => {
  const src = editor
    .getSession()
    .getDocument()
    .getValue();
  ipcRenderer.send('editor', src);
});

ipcRenderer.on('set-opened-files', (evt, fos) => {
  openedFiles.innerHTML = '';

  for (let i = 0; i < fos.length; i++) {
    const fo = fos[i];

    const li = document.createElement('li');
    li.setAttribute('data-file', fo.file);
    li.innerHTML = path.basename(fo.file);
    li.addEventListener('click', evt => {
      const file = evt.currentTarget.dataset.file;
      ipcRenderer.send('open', file);
    });

    openedFiles.appendChild(li);
  }
});

ipcRenderer.on('preview', (evt, msg) => {
  preview.innerHTML = msg;
});

ipcRenderer.on('open', (evt, fo) => {
  editor.getSession().setValue(fo.source);

  // set the active tab
  const active = openedFiles.querySelectorAll(`li.active`);
  if (active.length) {
    active.classList.remove('active');
  }

  const found = openedFiles.querySelector(`li[data-file="${fo.file}"]`);
  if (found) {
    found.classList.add('active');
  }
});

ipcRenderer.on('close', (evt, msg) => {
  editor.getSession().reset();
});

// initial render
document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send(
    'editor',
    editor
      .getSession()
      .getDocument()
      .getValue()
  );
});
