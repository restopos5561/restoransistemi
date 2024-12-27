const cors = require('cors');
const config = require('../config');

const corsOptions = {
    origin: config.cors.allowedOrigins || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 saat
};

module.exports = cors(corsOptions); 