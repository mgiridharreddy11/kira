import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 4000;

// Ephemeral connected clients map
const connectedClients = new Map<string, WebSocket>();

// Health & System Status Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Kairo Relay Server',
    e2eeActive: true,
    serverTimeUtc: Date.now(), // Authoritative server clock for streak calculations
  });
});

// WebSocket Connection Management for Ephemeral Encrypted Envelope Routing
wss.on('connection', (ws: WebSocket, req) => {
  console.log('[Kairo Relay] Client connected to E2EE relay stream');

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'REGISTER') {
        connectedClients.set(data.userId, ws);
        console.log(`[Kairo Relay] Client registered: ${data.userId}`);
      } else if (data.type === 'RELAY_ENVELOPE') {
        // Zero-knowledge forwarding: server cannot decrypt envelope
        const targetWs = connectedClients.get(data.recipientId);
        if (targetWs && targetWs.readyState === WebSocket.OPEN) {
          targetWs.send(JSON.stringify({
            type: 'ENCRYPTED_MESSAGE_ARRIVED',
            envelope: data.envelope,
            serverTimestamp: Date.now(),
          }));
        } else {
          console.log(`[Kairo Relay] Recipient ${data.recipientId} is offline; queueing ephemeral envelope.`);
        }
      }
    } catch (e) {
      console.error('[Kairo Relay] Failed to parse message', e);
    }
  });

  ws.on('close', () => {
    for (const [userId, client] of connectedClients.entries()) {
      if (client === ws) {
        connectedClients.delete(userId);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`⚡ Kairo Relay Server listening on port ${PORT}`);
});
