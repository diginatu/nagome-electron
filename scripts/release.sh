#!/bin/bash

# Automatic exit on error
set -e
set -o pipefail

. ./scripts/download_binaries.sh

rm -rf ./dist
$NPMBIN/build "$@"
