const WebSocket = require('ws');

class MutfakSocketHandler {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map();
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('New client connected');
            
            // Her yeni bağlantı için unique ID ata
            const clientId = this.generateClientId();
            this.clients.set(clientId, ws);

            // Client'a ID'sini gönder
            ws.send(JSON.stringify({ type: 'connection', clientId }));

            ws.on('message', (message) => this.handleMessage(ws, message, clientId));

            ws.on('close', () => {
                console.log('Client disconnected');
                this.clients.delete(clientId);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                this.clients.delete(clientId);
            });
        });
    }

    handleMessage(ws, message, clientId) {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'siparis_durumu':
                    this.handleSiparisDurumu(data, clientId);
                    break;
                    
                case 'yeni_siparis':
                    this.handleYeniSiparis(data);
                    break;
                    
                case 'siparis_iptal':
                    this.handleSiparisIptal(data);
                    break;
                    
                case 'mutfak_onay':
                    this.handleMutfakOnay(data);
                    break;
                    
                default:
                    console.warn('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    handleSiparisDurumu(data, excludeClientId) {
        const message = JSON.stringify({
            type: 'siparis_durumu_guncelleme',
            siparis: data.siparis
        });

        this.broadcastMessage(message, excludeClientId);
    }

    handleYeniSiparis(data) {
        const message = JSON.stringify({
            type: 'yeni_siparis_bildirimi',
            siparis: data.siparis
        });

        this.broadcastMessage(message);
    }

    handleSiparisIptal(data) {
        const message = JSON.stringify({
            type: 'siparis_iptal_bildirimi',
            siparis: data.siparis
        });

        this.broadcastMessage(message);
    }

    handleMutfakOnay(data) {
        const message = JSON.stringify({
            type: 'mutfak_onay_bildirimi',
            siparis: data.siparis
        });

        this.broadcastMessage(message);
    }

    broadcastMessage(message, excludeClientId = null) {
        this.clients.forEach((client, clientId) => {
            if (client.readyState === WebSocket.OPEN && clientId !== excludeClientId) {
                client.send(message);
            }
        });
    }

    generateClientId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Belirli bir client'a mesaj gönder
    sendToClient(clientId, message) {
        const client = this.clients.get(clientId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    }

    // Tüm bağlı client'ları getir
    getConnectedClients() {
        return Array.from(this.clients.keys());
    }

    // WebSocket sunucusunu kapat
    close() {
        this.wss.close();
    }
}

module.exports = MutfakSocketHandler; 