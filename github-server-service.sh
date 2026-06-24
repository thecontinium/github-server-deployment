#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# Extract secrets safely in-memory from native system layer
export GH_APP_ID=$(security find-generic-password -a "github-app" -s "pi-app-id" -w)
export GH_INSTALLATION_ID=$(security find-generic-password -a "github-app" -s "pi-app-installation-id" -w)
export GH_APP_PRIVATE_KEY=$(cat <(security find-generic-password -a "github-app" -s "pi-app-private-key-raw" -w))

# Route context to Homebrew install location dynamically
cd "$(dirname "$0")" || exit 1
exec node server.js
