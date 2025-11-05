const http = require('http');

/**
 * Crea y configura el servidor HTTP.
 * @param {WebSocket.Server} wss - La instancia del servidor WebSocket para obtener métricas.
 * @returns {http.Server} La instancia del servidor HTTP.
 */
function createHttpServer(wss) {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const allowedOrigins = [
        'https://liquid-glass-camera-client-b2brhedefac9fpfd.chilecentral-01.azurewebsites.net',
        'http://localhost:3000',
        'http://localhost:5000'
    ];

    return http.createServer((req, res) => {
        const origin = req.headers.origin;
        
        // Solo permitir orígenes específicos
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.url === '/status') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'running',
                environment: NODE_ENV,
                connections: wss.clients.size, // Obtiene el número de clientes del servidor WS
                uptime: process.uptime(),
            }));
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Servidor WebSocket en funcionamiento.');
        }
    });
}

module.exports = { createHttpServer };