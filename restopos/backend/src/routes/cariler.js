const express = require('express');
const router = express.Router();
const CariController = require('../controllers/CariController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    cariSchema,
    bakiyeSchema,
    borcSchema,
    borcOdemeSchema,
    limitSchema 
} = require('../validations/cari');

// Apply authentication to all routes
router.use(authenticateToken);

// Tüm carileri listele
router.get('/', authorize(['admin', 'mudur']), CariController.getAll);

// Yeni cari oluştur
router.post('/', [
    authorize(['admin']),
    validateRequest(cariSchema)
], CariController.create);

// Belirli bir cariyi getir
router.get('/:id', authorize(['admin', 'mudur']), CariController.getById);

// Belirli bir cariyi güncelle
router.put('/:id', [
    authorize(['admin']),
    validateRequest(cariSchema)
], CariController.update);

// Belirli bir cariyi sil
router.delete('/:id', authorize(['admin']), CariController.delete);

// Cari tipine göre carileri getir
router.get('/tip/:tip', authorize(['admin', 'mudur']), CariController.getByTip);

// Cari bakiye güncelle
router.put('/:id/bakiye', [
    authorize(['admin']),
    validateRequest(bakiyeSchema)
], CariController.updateBakiye);

// Cari borç ekle
router.post('/:id/borc', [
    authorize(['admin']),
    validateRequest(borcSchema)
], CariController.borcEkle);

// Cari borç öde
router.post('/:id/borc-ode', [
    authorize(['admin']),
    validateRequest(borcOdemeSchema)
], CariController.borcOde);

// Cari hareketleri getir
router.get('/:id/hareketler', authorize(['admin', 'mudur']), CariController.getHareketler);

// Cari adisyonları getir
router.get('/:id/adisyonlar', authorize(['admin', 'mudur']), CariController.getAdisyonlar);

// Cari ödemeleri getir
router.get('/:id/odemeler', authorize(['admin', 'mudur']), CariController.getOdemeler);

// Cari borç durumu getir
router.get('/:id/borc-durum', authorize(['admin', 'mudur']), CariController.getBorcDurum);

// Cari limit güncelle
router.put('/:id/limit', [
    authorize(['admin']),
    validateRequest(limitSchema)
], CariController.updateLimit);

module.exports = router;