Nagome-electron
===============

Electron UI plugin of [Nagome](https://github.com/diginatu/nagome) which is NicoNama comment viewer.

This repository packages Nagome Web UI from following repositories.

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

``` sh
# Install dependencies
yarn
# Download assets
yarn download
# Launch
yarn start
```

### Project relationship

First, Nagome-electron, this app, spawns `Nagome Web App Server` that spawns Nagome CLI and serve the static web page app packaged in this electron app.
And then Nagome-electron shows the web page.
The web page communicate with Nagome CLI via `Nagome Web App Server` using WebSocket.

* Nagome-electron: electron app
    * [Nagome Web App Server](https://github.com/diginatu/nagome-webapp_server): server (CLI)
        * [Nagome](https://github.com/diginatu/nagome): server (CLI)
        * [Nagome Web UI](https://github.com/diginatu/nagome-webui): static web app

![Relationship diagram](./relationship_diagram.svg)


Publish
-------

``` sh
# Increase version number in package.json
export GH_TOKEN="..."
yarn run release
# Publish the release in Github
```

### Package only

```
yarn run build
```
