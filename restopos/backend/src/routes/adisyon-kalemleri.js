const express = require('express');
const router = express.Router();
const AdisyonKalemiController = require('../controllers/AdisyonKalemiController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    adisyonKalemiSchema,
    adisyonKalemiDurumSchema,
    adisyonKalemiMiktarSchema,
    adisyonKalemiNotSchema,
    adisyonKalemiIptalSchema
} = require('../validations/adisyon-kalemi');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur']), AdisyonKalemiController.getAll);

router.post('/', [
    authorize(['admin', 'mudur']),
    validateRequest(adisyonKalemiSchema)
], AdisyonKalemiController.create);

router.get('/:id', authorize(['admin', 'mudur']), AdisyonKalemiController.getById);

router.put('/:id', [
    authorize(['admin', 'mudur']),
    validateRequest(adisyonKalemiSchema)
], AdisyonKalemiController.update);

router.delete('/:id', authorize(['admin']), AdisyonKalemiController.delete);

// Özel işlemler
router.put('/:id/durum', [
    authorize(['admin', 'mudur']),
    validateRequest(adisyonKalemiDurumSchema)
], AdisyonKalemiController.updateDurum);

router.put('/:id/miktar', [
    authorize(['admin', 'mudur']),
    validateRequest(adisyonKalemiMiktarSchema)
], AdisyonKalemiController.updateMiktar);

router.put('/:id/not', [
    authorize(['admin', 'mudur']),
    validateRequest(adisyonKalemiNotSchema)
], AdisyonKalemiController.updateNot);

router.post('/:id/iptal', [
    authorize(['admin']),
    validateRequest(adisyonKalemiIptalSchema)
], AdisyonKalemiController.iptalEt);

// Listeleme işlemleri
router.get('/adisyon/:adisyonId', authorize(['admin', 'mudur']), AdisyonKalemiController.getByAdisyon);
router.get('/urun/:urunId', authorize(['admin', 'mudur']), AdisyonKalemiController.getByUrun);
router.get('/durum/:durum', authorize(['admin', 'mudur']), AdisyonKalemiController.getByDurum);
router.get('/:id/gecmis', authorize(['admin', 'mudur']), AdisyonKalemiController.getDurumGecmisi);

module.exports = router;