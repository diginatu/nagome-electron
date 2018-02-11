const ipc = require('electron').ipcRenderer;
const {remote} = require('electron');
const {Menu} = remote;

const webview = document.getElementById('webview');

ipc.on('main-ui-url', (e, url) => {
    webview.src = url;
});

webview.addEventListener('page-title-updated', (e) => {
    document.title = e.title;
});

webview.addEventListener('new-window', (e) => {
    event.preventDefault();
    ipc.send('new-window', e.url);
});

// Context menu
const template = [
    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
    { type: 'separator' },
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
    { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
];
const menu = Menu.buildFromTemplate(template);
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);
