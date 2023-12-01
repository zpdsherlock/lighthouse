#!/usr/bin/env bash

##
# @license Copyright 2017 Google LLC
# SPDX-License-Identifier: Apache-2.0
##

# Download chrome inside of our CI env.
# Takes one arg - the location to extract ToT chrome to. Defaults to .tmp/chrome-tot
# If already exists, this script does nothing.

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LH_ROOT_DIR="$SCRIPT_DIR/../.."

chrome_out=${1:-"$LH_ROOT_DIR/.tmp/chrome-tot"}
mkdir -p "$LH_ROOT_DIR/.tmp"

if [ -e "$chrome_out" ]; then
  echo "cached chrome found"
  exit 0
fi

unameOut="$(uname -s)"
case "${unameOut}" in
  Linux*)     machine=Linux;;
  Darwin*)    machine=Mac;;
  MINGW*)     machine=MinGw;;
  *)          machine="UNKNOWN:${unameOut}"
esac

if [ "$machine" == "MinGw" ]; then
  url="https://download-chromium.appspot.com/dl/Win?type=snapshots"
elif [ "$machine" == "Linux" ]; then
  url="https://download-chromium.appspot.com/dl/Linux_x64?type=snapshots"
elif [ "$machine" == "Mac" ]; then
  arch="$(uname -m)"
  if [ "$arch" == "arm64" ]; then
    url="https://download-chromium.appspot.com/dl/Mac_Arm?type=snapshots"
  else
    url="https://download-chromium.appspot.com/dl/Mac?type=snapshots"
  fi
else
  echo "unsupported platform"
  exit 1
fi

mkdir -p .tmp-download && cd .tmp-download
curl "$url" -Lo chrome.zip && unzip -q chrome.zip && rm chrome.zip
mv * "$chrome_out"
cd - && rm -rf .tmp-download
