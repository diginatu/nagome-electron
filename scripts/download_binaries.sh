#!/bin/bash

. ./scripts/settings.sh

if ! [ -d $TMPDIR ]; then
    mkdir -p $TMPDIR
    $NPMBIN/download-github-release diginatu nagome $TMPDIR
    $NPMBIN/download-github-release diginatu nagome-webapp_server $TMPDIR
    $NPMBIN/download-github-release diginatu nagome-webui $TMPDIR
fi

rm -rf $RESOURCEDIR/
mkdir -p $RESOURCEDIR
cp -r $TMPDIR/app $RESOURCEDIR/webui

for system in ${SYSTEMS[@]}; do
    appendexe=$(echo $system | sed -e '/windows/! d ; /windows/c\.exe')
    os=$(echo $system | sed -e '/linux/c\linux' -e '/darwin/c\mac' -e '/windows/c\win')
    arch=$(echo $system | sed -e '/amd64/c\x64')
    echo "Putting binaries of $system as \"$os $arch\""

    systemdir=$RESOURCEDIR/system/$os/$arch
    mkdir -p $systemdir
    cp $TMPDIR/nagome_$system$appendexe $systemdir/nagome$appendexe
    chmod +x $systemdir/nagome$appendexe
    cp $TMPDIR/nagome-webapp_server_$system$appendexe $systemdir/server$appendexe
    chmod +x $systemdir/server$appendexe
done

rm -fr $EXTRADIRNAME
mkdir -p $EXTRADIRNAME
cd $EXTRADIRNAME
ln -s ../resources/system/linux/x64/* .
ln -s ../resources/webui .
cd ..
