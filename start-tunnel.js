const localtunnel = require('localtunnel');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 3000, subdomain: 'nurqissa-ai-' + Math.floor(Math.random() * 10000) });
    console.log('PUBLIC_TUNNEL_URL=' + tunnel.url);
    
    tunnel.on('close', () => {
      console.log('Tunnel closed');
      process.exit(0);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });

    // Keep process alive
    setInterval(() => {}, 10000);
  } catch (err) {
    console.error('Tunnel error:', err);
  }
})();

