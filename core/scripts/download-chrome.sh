#!/usr/bin/env bash

##
# @license Copyright 2017 Google LLC
# SPDX-License-Identifier: Apache-2.0
##

# Download chrome inside of our CI env.

set -euo pipefail

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

if [ -e "$CHROME_PATH" ]; then
  echo "cached chrome found"
else
  curl "$url" -Lo chrome.zip && unzip -q chrome.zip
fi
