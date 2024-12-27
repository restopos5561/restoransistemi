const jwt = require('jsonwebtoken');
const config = require('../config');
const { Kullanici } = require('../models/Kullanici');

/**
 * JWT token doğrulama middleware'i
 */
const authenticateToken = async (req, res, next) => {
    try {
        // Token'ı header'dan al
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Authentication Error',
                message: 'Token gerekli'
            });
        }

        // Token'ı doğrula
        const decoded = jwt.verify(token, config.jwtSecret);

        // Kullanıcıyı bul
        const kullanici = await Kullanici.findByPk(decoded.id);
        if (!kullanici) {
            return res.status(401).json({
                error: 'Authentication Error',
                message: 'Geçersiz token'
            });
        }

        // Kullanıcı bilgilerini request'e ekle
        req.user = kullanici;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Authentication Error',
                message: 'Token süresi dolmuş'
            });
        }
        
        res.status(401).json({
            error: 'Authentication Error',
            message: 'Geçersiz token'
        });
    }
};

/**
 * Rol bazlı yetkilendirme middleware'i
 * @param {Array} roles - İzin verilen roller
 */
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication Error',
                message: 'Yetkilendirme gerekli'
            });
        }

        if (roles.length && !roles.includes(req.user.rol_id)) {
            return res.status(403).json({
                error: 'Authorization Error',
                message: 'Bu işlem için yetkiniz yok'
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorize
}; 