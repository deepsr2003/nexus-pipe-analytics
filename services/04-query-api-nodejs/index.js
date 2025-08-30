const express = require('express');
const http = require('http');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const mysql = require('mysql2/promise'); // UPDATED: Use mysql2 promise wrapper
const { createClient } = require('redis');
const { format } = require('date-fns');

// --- Initializations --- (Unchanged)
const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// --- Database & Cache Connections ---

// MySQL connection pool (UPDATED)
const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'usr',
  password: 'pass',
  database: 'nexuspipedb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Redis client (Unchanged)
const redisClient = createClient();
redisClient.on('error', (err) => console.error('Redis Client Error', err));

// NEW: Create a duplicate client for Pub/Sub
const redisSubscriber = redisClient.duplicate();
redisSubscriber.on('error', (err) => console.error('Redis Subscriber Error', err));

// --- REST API for Historical Data ---
app.get('/api/historical-events', async (req, res) => {
  try {
    // UPDATED SQL Query for MySQL syntax
    // - DATE_FORMAT replaces DATE_TRUNC
    // - NOW() - INTERVAL 1 HOUR replaces INTERVAL '1 hour'
     const sqlQuery = `
      SELECT
        DATE_FORMAT(received_at, '%Y-%m-%dT%H:%i:00') AS minute,
        COUNT(*) AS event_count
      FROM events
      GROUP BY minute
      ORDER BY minute ASC;
    `;
        
    const [rows] = await mysqlPool.query(sqlQuery);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching historical data:', err);
    res.status(500).json({ error: 'Failed to retrieve historical data' });
  }
});

// --- WebSocket Server for Real-Time Data --- (Unchanged)
wss.on('connection', (ws) => {
  console.log('A new client connected to WebSocket.');
  ws.on('close', () => console.log('Client disconnected.'));
  ws.on('error', (error) => console.error('WebSocket Error:', error));
});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  });
}

setInterval(async () => {
  try {
    const currentMinute = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm');
    const redisKey = `events:count:${currentMinute}`;
    const count = await redisClient.get(redisKey);
    broadcast({
      type: 'live_event_update',
      payload: {
        timestamp: new Date().toISOString(),
        count: parseInt(count || '0', 10),
      }
    });
  } catch (err) {
    console.error('Error polling Redis or broadcasting:', err);
  }
}, 2000);

// --- Server Startup --- (Unchanged)
const PORT = 8080;
const start = async () => {
  await redisClient.connect();
  console.log('Redis client connected.');
  await redisSubscriber.connect();
  console.log('Redis subscriber connected.');
  // Test MySQL connection on startup
  const connection = await mysqlPool.getConnection();
  console.log('MySQL pool connected successfully.');
  connection.release();

  // NEW: Subscribe to the live events channel
  await redisSubscriber.subscribe('live-events-stream', (message) => {
    // When a message is received, broadcast it to all WebSocket clients
    console.log('Received event from Redis Pub/Sub:', message);
    broadcast({
      type: 'live_event_stream',
      payload: JSON.parse(message),
    });
  });
  
  server.listen(PORT, () => {
    console.log(`Query API and WebSocket server is running on http://localhost:${PORT}`);
  });
};

start().catch(err => {
  console.error('Failed to start query API service:', err);
  process.exit(1);
});
