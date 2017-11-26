#!/bin/bash

. ./script/settings.sh

if ! [ -d $TMPDIR ]; then
    mkdir -p $TMPDIR
    $NPMBIN/download-github-release diginatu nagome $TMPDIR
    $NPMBIN/download-github-release diginatu nagome-webapp_server $TMPDIR
    $NPMBIN/download-github-release diginatu nagome-webui $TMPDIR
fi
