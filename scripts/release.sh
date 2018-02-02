#!/bin/bash

# Automatic exit on error
set -e
set -o pipefail

. ./scripts/download_binaries.sh

cp ./images/icon.icns ./images/icon.ico $RESOURCEDIR

rm -rf ./dist
$NPMBIN/build "$@"
