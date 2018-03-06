const fs = require('fs');
const { Menu, dialog, shell } = require('electron');
const pkg = require('../../../package.json');
const file = require('../utils/file');

module.exports = (app, appState) => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click() {
            dialog.showOpenDialog(appState.mainWindow, filepaths => {
              if (filepaths.length > 0) {
                file.open(filepaths[0], app, appState);
              }
            });
          },
        },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click() {
            if (appState.currentFile && appState.currentSource !== null) {
              fs.writeFileSync(
                appState.currentFile,
                appState.currentSource,
                'utf8'
              );
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
                  appState.mainWindow,
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
            file.close();
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
};
