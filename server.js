import { createServer } from 'http';
import { createAppAuth } from "@octokit/auth-app";

const auth = createAppAuth({
  appId: process.env.GH_APP_ID,
  privateKey: process.env.GH_APP_PRIVATE_KEY, 
});

createServer(async (req, res) => {
  try {
    const installationAuth = await auth({ 
      type: "installation", 
      installationId: parseInt(process.env.GH_INSTALLATION_ID, 10) 
    });
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(installationAuth.token);
  } catch (error) {
    res.writeHead(500); res.end('Gateway Error');
  }
}).listen(8080, '127.0.0.1'); // Bound strictly to localhost for SSH Tunnel routing safety
