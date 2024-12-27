const express = require('express');
const router = express.Router();
const OdemeController = require('../controllers/OdemeController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    odemeSchema,
    odemeIptalSchema,
    odemeOnaySchema,
    odemeTarihSchema
} = require('../validations/odeme');

// Apply authentication to all routes
router.use(authenticateToken);

// Tüm ödemeleri listele
router.get('/', authorize(['admin', 'mudur']), OdemeController.getAll);

// Yeni ödeme oluştur
router.post('/', [
    authorize(['admin']),
    validateRequest(odemeSchema)
], OdemeController.create);

// Belirli bir ödemeyi getir
router.get('/:id', authorize(['admin', 'mudur']), OdemeController.getById);

// Belirli bir ödemeyi güncelle
router.put('/:id', [
    authorize(['admin']),
    validateRequest(odemeSchema)
], OdemeController.update);

// Belirli bir ödemeyi sil
router.delete('/:id', authorize(['admin']), OdemeController.delete);

// Adisyona göre ödemeleri getir
router.get('/adisyon/:adisyonId', authorize(['admin', 'mudur']), OdemeController.getByAdisyon);

// Cariye göre ödemeleri getir
router.get('/cari/:cariId', authorize(['admin', 'mudur']), OdemeController.getByCari);

// Ödeme tiplerine göre ödemeleri getir
router.get('/tip/:tip', authorize(['admin', 'mudur']), OdemeController.getByTip);

// Tarih aralığına göre ödemeleri getir
router.get('/tarih', [
    authorize(['admin', 'mudur']),
    validateRequest(odemeTarihSchema)
], OdemeController.getByTarihAralik);

// Ödeme iptali
router.post('/:id/iptal', [
    authorize(['admin']),
    validateRequest(odemeIptalSchema)
], OdemeController.iptalEt);

// Ödeme onayı
router.post('/:id/onay', [
    authorize(['admin']),
    validateRequest(odemeOnaySchema)
], OdemeController.onayVer);

module.exports = router;