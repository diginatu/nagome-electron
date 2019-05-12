const ipc = require('electron').ipcRenderer;

window.onload = function() {
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
}
