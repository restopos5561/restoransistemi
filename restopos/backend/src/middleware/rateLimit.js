const rateLimit = require('express-rate-limit');
const config = require('../config');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: config.rateLimit.maxRequests || 100, // Her IP için maksimum istek sayısı
    message: {
        status: 'error',
        message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = limiter; 