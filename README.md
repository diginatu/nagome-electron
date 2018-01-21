Nagome-electron
===============

Electron UI plugin of [Nagome](https://github.com/diginatu/nagome) which is NicoNama comment viewer.

This repository packages Nagome Web UI from following repositories.

* [Nagome](https://github.com/diginatu/nagome)
* [Nagome Web UI](https://github.com/diginatu/nagome-webui)
* [Nagome Web App Server](https://github.com/diginatu/nagome-webapp_server)

#### License [MIT](LICENSE)

Download
--------

[Github Releases](https://github.com/diginatu/nagome-electron/releases/latest)

Binary name | Environment
:-|:-
nagome-electron-[version]-mac.zip | OSX
nagome-electron-[version]-x86_64.AppImage | Linux [AppImage](https://appimage.org/)
nagome-electron-[version].tar.xz | Linux executable binary
nagome-electron\_[version]\_amd64.deb | Linux Debian Installer
nagome-electron-[version].exe | Windows binary
nagome-electron-setup-[version].exe | Windows Installer


Develop
-------

```
yarn
```

Publish
-------

```
# increase version number in package.json
export GH_TOKEN="..."
yarn run release
```

### Package only

```
yarn run build
```
