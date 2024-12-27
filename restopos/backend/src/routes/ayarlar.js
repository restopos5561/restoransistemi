const express = require('express');
const router = express.Router();
const AyarlarController = require('../controllers/AyarlarController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    ayarlarSchema,
    yaziciAyarlarSchema,
    bildirimAyarlarSchema,
    sistemAyarlarSchema
} = require('../validations/ayarlar');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur']), AyarlarController.getAll);

router.get('/:key', [
    authorize(['admin', 'mudur']),
    validateRequest(ayarlarSchema.getByKey)
], AyarlarController.getByKey);

router.put('/:key', [
    authorize(['admin']),
    validateRequest(ayarlarSchema.update)
], AyarlarController.update);

router.put('/', [
    authorize(['admin']),
    validateRequest(ayarlarSchema.updateMultiple)
], AyarlarController.updateMultiple);

// Yazıcı ayarları
router.get('/yazici/ayarlar', authorize(['admin', 'mudur']), AyarlarController.getYaziciAyarlar);

router.put('/yazici/ayarlar', [
    authorize(['admin']),
    validateRequest(yaziciAyarlarSchema)
], AyarlarController.updateYaziciAyarlar);

// Bildirim ayarları
router.get('/bildirim/ayarlar', authorize(['admin', 'mudur']), AyarlarController.getBildirimAyarlar);

router.put('/bildirim/ayarlar', [
    authorize(['admin']),
    validateRequest(bildirimAyarlarSchema)
], AyarlarController.updateBildirimAyarlar);

// Sistem ayarları
router.get('/sistem/ayarlar', authorize(['admin', 'mudur']), AyarlarController.getSistemAyarlar);

router.put('/sistem/ayarlar', [
    authorize(['admin']),
    validateRequest(sistemAyarlarSchema)
], AyarlarController.updateSistemAyarlar);

module.exports = router; 