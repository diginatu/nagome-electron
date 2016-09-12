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
        exports.connect(text);

        return false;
    };
}

// aujust height of the table
//window.onresize = () => {
{
    const holder = document.getElementById('holder');
    const head_form_h = document.getElementById('head_form').offsetHeight;
    holder.style.height = `calc(100% - ${head_form_h}px)`;
}


// functions for main process

electron.ipcRenderer.on('addComment', (ev, cmm) => {
    let tr = document.createElement('tr');
    tr.innerHTML = cmm;

    document.getElementById('comment_tb_body').appendChild(tr);
});

electron.ipcRenderer.on('changeStatus', (ev, aud, time) => {
    console.log(aud, time);
    document.getElementById('audience').innerHTML = aud;
    document.getElementById('num_comments').innerHTML = time;
});


// exports

exports.connect = (id) => {
    const main = electron.remote.require('./main');

    let connectst = {
        'domain': 'nagome_query',
        'command': 'Broad.Connect',
        'content': {
            'broad_id': id
        }
    };
    main.nagomeWrite(JSON.stringify(connectst));
};

