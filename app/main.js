const autoUpdater = require('electron-updater').autoUpdater;
const electron = require('electron');
const log = require('electron-log');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');

const path = require('path');
const spawn = require('child_process').spawn;
const os = require('os');
const readline = require('readline');

const isWin = /^win/.test(os.platform());
let resoucesDir = isDev ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');
const serverExecFile = path.join(resoucesDir, 'extra', isWin ? 'server.exe' : 'server');
let mainUIURL = '';

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
    app.quit();
}

function showErrorBox(title, error) {
    log.error(title + ': ' + error);
    electron.dialog.showErrorBox(title,error);
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 500, height: 800});

    if (mainUIURL === '') {
        showErrorBox('Open URL Error', 'Failed to get the server URL');
        quitNow();
    }
    // and load the index.html of the app.
    mainWindow.loadURL(mainUIURL);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

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
    uiServerExec = spawn(serverExecFile, {cwd: resoucesDir});

    let errorLogs = '';

    uiServerExec.on('close', (code) => {
        if (code !== 0) {
            showErrorBox('Nagome server Error', `ps process exited with code ${code}`);
            quitNow();
        }
        if (errorLogs !== '') {
            showErrorBox('Server Error', errorLogs);
            quitNow();
        }
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
        if (mainUIURL === '') {
            if (line.startsWith('http')) {
                mainUIURL = line;

                createWindow();
            } else {
                showErrorBox('Nagome server error', 'Failed to get URL');
                quitNow();
            }
        }
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    uiServerExec.stdin.end();
    uiServerExec = null;

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
    if (uiServerExec === null) {
        executeUIServer();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
