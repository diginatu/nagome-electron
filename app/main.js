const autoUpdater = require('electron-updater').autoUpdater;
const electron = require('electron');
const ipc = require('electron').ipcMain;
const log = require('electron-log');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
const spawn = require('child_process').spawn;
const os = require('os');
const readline = require('readline');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Module to create native application menus and context menus.
const Menu = electron.Menu;

const isWin = /^win/.test(os.platform());
const resoucesDir = isDev ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');
const serverExecFile = path.join(resoucesDir, 'extra', isWin ? 'server.exe' : 'server');
const uiServerArgs = ['-c', isDev ? './server_config_dev.json' : './server_config.json'];

// Logging
autoUpdater.logger = log;
if (isDev) {
    autoUpdater.logger.transports.file.level = 'debug';
} else {
    autoUpdater.logger.transports.file.level = 'info';
}
log.info('App starting...');

function quitNow() {
    mainWindow = null;
    if (uiServerExec !== null) {
        uiServerExec.stdin.end();
        uiServerExec = null;
    }
}

function showErrorBox(title, error) {
    log.error(title + ': ' + error);
    electron.dialog.showErrorBox(title,error);
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

function createWindow(mainUIURL) {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 500, height: 800, icon: path.join(__dirname, '..', 'images', 'icon.png')});

    // Open in external browser
    ipc.on('new-window', (e, url) => {
        electron.shell.openExternal(url);
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.send('main-ui-url', mainUIURL);
    });

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

let uiServerExec;

function executeUIServer() {
    log.debug('Resouce directory: ' + resoucesDir);
    uiServerExec = spawn(serverExecFile, uiServerArgs, {cwd: resoucesDir});

    let errorLogs = '';

    uiServerExec.on('close', (code) => {
        if (code !== 0) {
            showErrorBox('Nagome server Error', `ps process exited with code ${code}`);
        }
        if (isDev && errorLogs !== '') {
            showErrorBox('Server Error', errorLogs);
        }
        quitNow();
    });

    uiServerExec.on('exit', () => {
        app.quit();
    });

    uiServerExec.stderr.on('data', function(buf) {
        errorLogs += buf;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    autoUpdater.checkForUpdatesAndNotify();
    executeUIServer();

    const rl = readline.createInterface({
        input: uiServerExec.stdout
    });

    rl.on('line', (line) => {
        log.info(`Nagome server stdout: ${line}`);
        if (mainWindow === null) {
            if (line.startsWith('http')) {
                createWindow(line);
            }
        }
    });

    const template = [{
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectall' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    }];

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                {role: 'about'},
                {type: 'separator'},
                {role: 'services', submenu: []},
                {type: 'separator'},
                {role: 'quit'}
            ]
        });

        template[3].submenu = [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' }
        ]
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    quitNow();
});

// Fasten app quit
app.on('will-quit', function() {
    quitNow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
