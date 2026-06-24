# GitHub Token Server User-Space Deployment

This repository handles user-space isolated deployments for the **GitHub Token Server**, utilizing centralized Node configurations via an administrator while isolating keys and daemons per-user.

## 🚀 Individual User Setup
```bash
# 1. Pull down this module configuration directory
git clone https://github.com/YOUR_GITHUB_USERNAME/github-token-server-deployment.git
cd github-token-server-deployment

# 2. Run the local setup installer
./install.sh
```

### 🔑 Secure Keychain Configuration Required

Before starting the background service, you must securely inject your GitHub App secrets into the native macOS Keychain. Run these 3 commands:

1. **Store your App ID:**
   ```bash
   security add-generic-password -a "github-app" -s "pi-app-id" -w "YOUR_APP_ID"
   ```

2. **Store your App Installation ID:**
   ```bash
   security add-generic-password -a "github-app" -s "pi-app-installation-id" -w "YOUR_INSTALLATION_ID"
   ```

3. **Stream your raw PEM private key block into the secure vault:**
   ```bash
   security add-generic-password -a "github-app" -s "pi-app-private-key-raw" -w - < /path/to/your-key.pem
   ```

> ⚠️ **IMPORTANT:** Once securely saved to the Keychain, remember to delete the physical .pem file from disk (`rm /path/to/your-key.pem`).

---

## ⚙️ Operations
* **Runtime Logs:** `tail -f ~/Library/Logs/github-server.log`
* **Stop Service:** `launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/local.github-server.plist`
* **Start Service:** `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/local.github-server.plist`
