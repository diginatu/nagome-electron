// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');

// Drag Event
// Disable document Drag
{
    document.ondragover = document.ondrop = function(e) {
        e.preventDefault();
        return false;
    };
    const holder = document.getElementById('holder');
    holder.ondragover = function () {
        return false;
    };
    holder.ondragleave = holder.ondragend = function () {
        return false;
    };
    holder.ondrop = function (e) {
        e.preventDefault(); // stop moving page

        var text = e.dataTransfer.getData('Text');
        console.log(text);

        exports.connect(text);

        return false;
    };
}


// functions for main process

electron.ipcRenderer.on('addComment', (ev, cmm) => {
    let tr = document.createElement('tr');
    tr.innerHTML = cmm;

    document.getElementById('comment_tb_body').appendChild(tr);
});


// exports

exports.connect = (id) => {
    const main = electron.remote.require('./main');

    let connectst = {
        'Domain': 'nagome_query',
        'Command': 'Broad.Connect',
        'Content': {
            'BroadID': id
        }
    };
    console.log(connectst);
    main.nagomeWrite(JSON.stringify(connectst));
};

