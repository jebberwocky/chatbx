#!/bin/bash
# Setup
APP_PATH="/Users/jeff/AndroidStudioProjects/themonkey/app/src/main/assets/localweb"
# Helper functions
info() {
  echo -e "\033[1;34m$@\033[0m"
}

error() {
  echo -e "\033[1;31m$@\033[0m" >&2
}
info "start copying ./build to ${APP_PATH}"
cp -R ./build ${APP_PATH}
