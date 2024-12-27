const express = require('express');
const router = express.Router();
const LisansController = require('../controllers/LisansController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    lisansSchema,
    lisansDurumSchema,
    lisansAktivasyonSchema,
    lisansYenilemeSchema,
    lisansIptalSchema
} = require('../validations/lisans');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin']), LisansController.getAll);

router.post('/', [
    authorize(['admin']),
    validateRequest(lisansSchema)
], LisansController.create);

router.get('/:id', authorize(['admin']), LisansController.getById);

router.put('/:id', [
    authorize(['admin']),
    validateRequest(lisansSchema)
], LisansController.update);

router.delete('/:id', authorize(['admin']), LisansController.delete);

// Özel işlemler
router.put('/:id/durum', [
    authorize(['admin']),
    validateRequest(lisansDurumSchema)
], LisansController.updateDurum);

router.post('/:id/aktivasyon', [
    authorize(['admin']),
    validateRequest(lisansAktivasyonSchema)
], LisansController.aktivasyonYap);

router.post('/:id/yenileme', [
    authorize(['admin']),
    validateRequest(lisansYenilemeSchema)
], LisansController.yenile);

router.post('/:id/iptal', [
    authorize(['admin']),
    validateRequest(lisansIptalSchema)
], LisansController.iptalEt);

// Listeleme işlemleri
router.get('/durum/:durum', authorize(['admin']), LisansController.getByDurum);
router.get('/musteri/:musteriId', authorize(['admin']), LisansController.getByMusteri);
router.get('/:id/gecmis', authorize(['admin']), LisansController.getGecmis);
router.get('/:id/istatistikler', authorize(['admin']), LisansController.getIstatistikler);

module.exports = router;