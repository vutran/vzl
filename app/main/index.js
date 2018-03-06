const fs = require('fs');
const path = require('path');
const url = require('url');
const Viz = require('viz.js');
const pkg = require('../../package.json');
const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  shell,
} = require('electron');

let svg = null; // the currently rendered svg
let mainWindow = null; // the main window
let currentSource = null; // the currently opened file source
let currentFile = null; // the currently opened file

ipcMain.on('editor', (evt, msg) => {
  try {
    currentSource = msg;
    svg = Viz(currentSource);
    evt.sender.send('preview', svg);
  } catch (err) {}
});

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    textAreasAreResizable: false,
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });

  const pathname = path.resolve(__dirname, '..', 'renderer', 'index.html');

  mainWindow.loadURL(
    url.format({
      pathname,
      protocol: 'file:',
      slashes: true,
    })
  );

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click() {
            dialog.showOpenDialog(mainWindow, filepaths => {
              if (filepaths.length > 0) {
                currentFile = filepaths[0];
                currentSrc = fs.readFileSync(currentFile, 'utf8');
                mainWindow.webContents.send('open', currentSrc);
              }
            });
          },
        },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click() {
            if (currentFile && currentSource !== null) {
              fs.writeFileSync(currentFile, currentSource, 'utf8');
            }
          },
        },
        {
          label: 'Export as',
          submenu: [
            {
              label: 'SVG',
              click() {
                dialog.showSaveDialog(
                  mainWindow,
                  { defaultPath: 'Untitled.svg' },
                  filename => {
                    if (filename && svg) {
                      fs.writeFile(filename, svg);
                    }
                  }
                );
              },
            },
          ],
        },
        {
          label: 'Close File',
          click() {
            currentSource = null;
            currentFile = null;
            mainWindow.webContents.send('close');
          },
        },
        {
          label: 'Quit',
          accelerator: 'CommandOrControl+Q',
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      role: 'editMenu',
    },
    {
      label: 'Window',
      role: 'windowMenu',
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About ' + app.getName(),
          click() {
            shell.openExternal(pkg.repository.url);
          },
        },
        {
          label: 'The DOT Language',
          click() {
            shell.openExternal(
              'https://graphviz.gitlab.io/_pages/doc/info/lang.html'
            );
          },
        },
        {
          label: 'Dot User Guide',
          click() {
            shell.openExternal(
              'https://graphviz.gitlab.io/_pages/pdf/dotguide.pdf'
            );
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
