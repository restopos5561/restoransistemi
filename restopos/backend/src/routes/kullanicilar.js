const express = require('express');
const router = express.Router();
const KullaniciController = require('../controllers/KullaniciController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const kullaniciSchema = require('../validations/kullanici');

// Tüm kullanıcıları getir
router.get('/', 
    authenticateToken,
    authorize(['admin']),
    KullaniciController.getAll
);

// Kullanıcı detayı
router.get('/:id', 
    authenticateToken,
    authorize(['admin']),
    KullaniciController.getById
);

// Yeni kullanıcı oluştur
router.post('/',
    authenticateToken,
    authorize(['admin']),
    validateRequest(kullaniciSchema.create),
    KullaniciController.create
);

// Kullanıcı güncelle
router.put('/:id',
    authenticateToken,
    authorize(['admin']),
    validateRequest(kullaniciSchema.update),
    KullaniciController.update
);

// Kullanıcı sil
router.delete('/:id',
    authenticateToken,
    authorize(['admin']),
    KullaniciController.delete
);

// Kullanıcı giriş
router.post('/login',
    validateRequest(kullaniciSchema.login),
    KullaniciController.login
);

// Şifre değiştir
router.post('/change-password',
    authenticateToken,
    validateRequest(kullaniciSchema.changePassword),
    KullaniciController.changePassword
);

module.exports = router; 