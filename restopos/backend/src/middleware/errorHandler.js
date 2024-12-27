const config = require('../config');

/**
 * Hata işleyici middleware
 */
const errorHandler = (err, req, res, next) => {
    // Hata detaylarını logla
    console.error('Hata:', {
        message: err.message,
        stack: config.env === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
        timestamp: new Date().toISOString()
    });

    // Hata tipine göre yanıt döndür
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            details: err.details
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Yetkilendirme başarısız'
        });
    }

    if (err.name === 'ForbiddenError') {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Bu işlem için yetkiniz yok'
        });
    }

    if (err.name === 'NotFoundError') {
        return res.status(404).json({
            error: 'Not Found',
            message: err.message || 'İstenen kaynak bulunamadı'
        });
    }

    if (err.name === 'ConflictError') {
        return res.status(409).json({
            error: 'Conflict',
            message: err.message
        });
    }

    // Veritabanı hataları
    if (err.code === '23505') { // Unique violation
        return res.status(409).json({
            error: 'Conflict',
            message: 'Bu kayıt zaten mevcut'
        });
    }

    if (err.code === '23503') { // Foreign key violation
        return res.status(409).json({
            error: 'Conflict',
            message: 'İlişkili kayıt bulunamadı'
        });
    }

    // Geliştirme ortamında hata detaylarını göster
    if (config.env === 'development') {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message,
            stack: err.stack
        });
    }

    // Prodüksiyon ortamında genel hata mesajı göster
    return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Bir hata oluştu'
    });
};

module.exports = errorHandler; 