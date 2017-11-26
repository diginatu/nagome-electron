#!/bin/bash

# Automatic exit on error
set -e
set -o pipefail

. ./scripts/settings.sh
./scripts/download_binaries.sh

rm -rf $RESOURCEDIR/
mkdir -p $RESOURCEDIR
rm -rf ./dist
cp -r $TMPDIR/app $RESOURCEDIR/webui

for arch in ${ARCHS[@]}; do
    ./scripts/set_binaries.sh $arch

    $NPMBIN/build $osflag $archflag "$@"

    rm -f $RESOURCEDIR/nagome $RESOURCEDIR/server
done
