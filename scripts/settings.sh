#!/bin/bash

SYSTEMS=("darwin_amd64" "linux_amd64" "windows_amd64")
TMPDIR="/tmp/nagome_electron_release"
NPMBIN=$(yarn bin)
RESOURCEDIR="./resources"
EXTRADIRNAME="extra"
