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

let svg = null;

let mainWindow = null;

ipcMain.on('editor', (evt, msg) => {
    try {
        svg = Viz(msg);
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
    });

    const pathname = path.resolve(__dirname, '..', 'renderer', 'index.html');

    mainWindow.loadURL(
        url.format({
            pathname,
            protocol: 'file:',
            slashes: true,
        })
    );

    mainWindow.openDevTools();

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    accelerator: 'CommandOrControl+O',
                    click() {
                        dialog.showOpenDialog(
                            mainWindow,
                            filepaths => {
                                if (filepaths.length > 0) {
                                    const first = filepaths[0];
                                    const src = fs.readFileSync(first, 'utf8');
                                    mainWindow.webContents.send('open', src);
                                }
                            },
                        );
                    }
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
                        shell.openExternal('https://graphviz.gitlab.io/_pages/doc/info/lang.html');
                    },
                },
                {
                    label: 'Dot User Guide',
                    click() {
                        shell.openExternal('https://graphviz.gitlab.io/_pages/pdf/dotguide.pdf');
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
