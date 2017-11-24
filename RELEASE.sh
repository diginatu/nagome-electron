#!/bin/bash

# Automatic exit on error
set -e
set -o pipefail

ARCHS=("darwin_amd64" "linux_amd64" "windows_amd64")
TMPDIR="/tmp/nagome_electron_release"
NPMBIN=$(yarn bin)
RESOURCEDIR="./app/resources"

mkdir -p $TMPDIR
if ! [ -d $TMPDIR ]; then
    $NPMBIN/download-github-release diginatu nagome $TMPDIR
    $NPMBIN/download-github-release diginatu nagome-webapp_server $TMPDIR
    $NPMBIN/download-github-release diginatu nagome-webui $TMPDIR
fi

rm -rf $RESOURCEDIR/
mkdir -p $RESOURCEDIR
rm -rf ./dist
cp -r $TMPDIR/app $RESOURCEDIR/webui

for arch in ${ARCHS[@]}; do
    appendexe=$(echo $arch | sed -e '/windows/! d ; /windows/c\.exe')
    osflag=$(echo $arch | sed -e '/linux/c\--linux' -e '/darwin/c\--mac' -e '/windows/c\--windows')
    archflag=$(echo $arch | sed -e '/amd64/c\--x64')
    echo "Creating release for $arch with falg \"$osflag $archflag\""

    cp -r $TMPDIR/nagome_$arch$appendexe $RESOURCEDIR/nagome$appendexe
    cp -r $TMPDIR/nagome-webapp_server_$arch$appendexe $RESOURCEDIR/server$appendexe

    $NPMBIN/build $osflag $archflag "$@"

    rm -f $RESOURCEDIR/nagome $RESOURCEDIR/server
done
