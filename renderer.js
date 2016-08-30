// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');

// Drag Event
// Disable document Drag
document.ondragover = document.ondrop = function(e) {
    e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
    return false;
};
var holder = document.getElementById('holder');
/** hoverエリアにドラッグされた場合 */
holder.ondragover = function () {
    return false;
};
/** hoverエリアから外れた or ドラッグが終了した */
holder.ondragleave = holder.ondragend = function () {
    return false;
};
/** hoverエリアにドロップされた */
holder.ondrop = function (e) {
    e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする

    var text = e.dataTransfer.getData('Text');
    console.log(text);

    exports.connect(text);

    return false;
};

electron.ipcRenderer.on('addComment', (ev, cmm) => {
    var tr = document.createElement('tr');
    tr.innerHTML = cmm;

    document.getElementById('comment_tb').appendChild(tr);
});

exports.connect = (id) => {
    const main = electron.remote.require('./main');

    var connectst = {
        'Domain': 'nagome_query',
        'Command': 'Broad.Connect',
        'Content': {
            'BroadID': id
        }
    };
    console.log(connectst);
    main.nagomeWrite(JSON.stringify(connectst));
};

