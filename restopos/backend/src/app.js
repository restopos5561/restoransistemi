const express = require('express');
const http = require('http');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const MutfakSocketHandler = require('./websocket/MutfakSocketHandler');
const { handleUploadError } = require('./middleware/fileUpload');

const app = express();
const server = http.createServer(app);

// WebSocket handler'ı başlat
const mutfakSocket = new MutfakSocketHandler(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Statik dosya sunumu için uploads klasörünü aç
app.use('/uploads', express.static('uploads'));

// Upload error handler
app.use(handleUploadError);

// Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

// WebSocket handler'ı app objesine ekle
app.mutfakSocket = mutfakSocket;

module.exports = { app, server }; 