import { createServer } from 'http';
import { createAppAuth } from "@octokit/auth-app";

// 1. Validate that all required environment variables exist
const requiredEnvVars = [
  'GH_APP_PRIVATE_KEY',
  'GH_APP_ID',
  'GH_INSTALLATION_ID'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error("❌ Initialization Error: Missing required environment variables:");
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

console.log("🔄 Initializing GitHub App Authentication...");

// 2. Decode the private key from hex
let privateKey;
try {
  const hexPrivateKey = process.env.GH_APP_PRIVATE_KEY;
  privateKey = Buffer.from(hexPrivateKey, 'hex').toString('utf8');

  if (!privateKey.includes("-----BEGIN")) {
    throw new Error("Decoded key does not appear to be a valid PEM format.");
  }
  console.log("✅ Private key successfully decoded from hex.");
} catch (error) {
  console.error("❌ Critical Error decoding GH_APP_PRIVATE_KEY:", error.message);
  process.exit(1);
}

// 3. Initialize Octokit Auth App
const appId = process.env.GH_APP_ID;
const auth = createAppAuth({
  appId: appId,
  privateKey: privateKey,
});
console.log(`✅ GitHub App Auth configured for App ID: ${appId}`);

// 4. Create the server
const PORT = 8080;
const HOST = '127.0.0.1';

const server = createServer(async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 📥 Received request from ${req.socket.remoteAddress}`);

  try {
    const installationIdStr = process.env.GH_INSTALLATION_ID;
    const installationId = parseInt(installationIdStr, 10);

    if (isNaN(installationId)) {
      throw new Error(`GH_INSTALLATION_ID is not a valid number (got: "${installationIdStr}")`);
    }

    console.log(`[${timestamp}] 🔑 Requesting installation token for ID: ${installationId}...`);

    const installationAuth = await auth({
      type: "installation",
      installationId: installationId
    });

    console.log(`[${timestamp}] 🚀 Token successfully generated. Sending response.`);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(installationAuth.token);

  } catch (error) {
    console.error(`[${timestamp}] ❌ Error generating token:`, error.message);

    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Gateway Error');
  }
});

// 5. Start listening
server.listen(PORT, HOST, () => {
  console.log(`\n🚀 Server is running and strictly bound to http://${HOST}:${PORT}`);
  console.log("🟢 Waiting to supply Access Tokens via SSH Tunnel routing...\n");
});
