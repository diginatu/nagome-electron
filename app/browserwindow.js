const ipc = require('electron').ipcRenderer;
const {remote} = require('electron');
const {Menu, MenuItem} = remote;

window.onload = function() {
    window.addEventListener('page-title-updated', (e) => {
        console.log("page-title-updated: view");
        document.title = e.title;
    });

    window.addEventListener('new-window', (e) => {
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
};
