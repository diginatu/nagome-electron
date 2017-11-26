#!/bin/bash

. ./scripts/settings.sh
arch=$1
appendexe=$(echo $arch | sed -e '/windows/! d ; /windows/c\.exe')
osflag=$(echo $arch | sed -e '/linux/c\--linux' -e '/darwin/c\--mac' -e '/windows/c\--windows')
archflag=$(echo $arch | sed -e '/amd64/c\--x64')
echo "Setting binaries of $arch with flag \"$osflag $archflag\""

cp -r $TMPDIR/nagome_$arch$appendexe $RESOURCEDIR/nagome$appendexe
chmod +x $RESOURCEDIR/nagome$appendexe
cp -r $TMPDIR/nagome-webapp_server_$arch$appendexe $RESOURCEDIR/server$appendexe
chmod +x $RESOURCEDIR/server$appendexe
