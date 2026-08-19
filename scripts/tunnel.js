const localtunnel = require('localtunnel');

async function runTunnel() {
  while (true) {
    try {
      console.log('Tunnel ishga tushirilmoqda...');
      const tunnel = await localtunnel({ port: 3000, subdomain: 'nurqissa-ai-demo' });
      console.log('TUNNEL_ACTIVE_URL:', tunnel.url);

      await new Promise((resolve) => {
        tunnel.on('close', () => {
          console.log('Tunnel yopildi, qayta ulanmoqda...');
          resolve();
        });
        tunnel.on('error', (err) => {
          console.log('Tunnel xatosi:', err.message);
          resolve();
        });
      });
    } catch (err) {
      console.log('Ulanishda xatolik yuz berdi:', err.message);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
}

runTunnel();
