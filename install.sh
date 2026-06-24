#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo "🛠️ GitHub Token Server User-Space Installer"
echo "=================================================="

if ! command -v node &>/dev/null; then
  echo "❌ Error: 'node' was not found in the environment PATH." >&2
  echo "Please have the Central Homebrew Owner run: brew install node" >&2
  exit 1
fi

LOCAL_BIN="$HOME/.local/bin"
SERVER_SHARE="$HOME/.local/share/github-token-server/src"
LAUNCH_AGENTS="$HOME/Library/LaunchAgents"

mkdir -p "$LOCAL_BIN" "$SERVER_SHARE" "$LAUNCH_AGENTS"

echo "🟢 Provisioning script source modules..."
cp -R ./src/* "$SERVER_SHARE/"

echo "📦 Running production package installation..."
cd "$SERVER_SHARE"
npm install --production
cd - >/dev/null

echo "🚚 Deploying runner to $LOCAL_BIN..."
cp github-server-service "$LOCAL_BIN/github-server-service"
chmod +x "$LOCAL_BIN/github-server-service"

echo "🚀 Configuring launchd service agent..."
TARGET_PLIST="$LAUNCH_AGENTS/local.github-server.plist"

launchctl bootout gui/"$(id -u)" "$TARGET_PLIST" 2>/dev/null || true
sed "s|HOME_DIR|$HOME|g" local.github-server.plist >"$TARGET_PLIST"
launchctl bootstrap gui/"$(id -u)" "$TARGET_PLIST"

echo "=================================================="
echo "🎉 User Server Installation Complete!"
echo "=================================================="
