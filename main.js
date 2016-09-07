const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const storage = require('electron-json-storage');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
// Nagome process
let nagome;
// buffer for input from Nagome
let nagomebuf = '';
let config;

function createWindow () {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => {
        if (nagome !== undefined) {
            nagome.stdin.end();
        }

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    saveConfig();
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

function loadConfigAndRunNagome() {
    storage.get('config', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        config = data;
        console.log(config);

        runNagome();
    });
}

function saveConfig() {
    storage.set('config', config, (err) => {
        console.log(err);
    });
}

function runNagome() {
    const spawn = require('child_process').spawn;

    if (config.nagomePath === undefined) {
        config.nagomePath = './nagome';
    }
    nagome = spawn(config.nagomePath, ['--dbgtostd']);

    nagome.stdout.on('data', (data) => {
        // join and process messages 
        nagomebuf += data.toString();
        for (;;) {
            if (nagomebuf === '' || nagomebuf === '\n' || nagomebuf.indexOf('\n') === -1) {
                break;
            }
            let spmes = nagomebuf.split('\n', 2);
            let mess = spmes[0];

            nagomebuf = nagomebuf.substring(mess.length + 1);
            let mes = JSON.parse(mess);

            switch (mes.domain) {
            case 'nagome_comment':
                if (mes.command === 'Comment.Got') {
                    mainWindow.webContents.send('addComment',
                                `<td>${mes.content.No}</td><td>${mes.content.UserID}</td><td>${mes.content.Comment}</td>`);
                }
                break;

            case 'nagome':
                switch (mes.command) {
                case 'Nagome.BroadInfo':

                    break;

                default:

                }

                break;


            default:
                console.log(mes);
            }
        }

    });

    nagome.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    nagome.stdout.on('error', (data) => {
        console.log(`nagome error ${data}`);
        nagome.stdin.end();
    });
    nagome.stdin.on('error', (data) => {
        console.log(`nagome error ${data}`);
        nagome.stdin.end();
    });

    nagome.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        app.quit();
    });
}

// main

app.on('ready', () => {
    loadConfigAndRunNagome();
    createWindow();
});


// exports

exports.nagomeWrite = (s) => {
    nagome.stdin.write(s);
};
