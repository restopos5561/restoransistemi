const express = require('express');
const router = express.Router();
const UrunController = require('../controllers/UrunController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    urunSchema,
    urunDurumSchema,
    urunFiyatSchema,
    urunStokSchema,
    urunResimSchema,
    urunTopluGuncellemeSchema
} = require('../validations/urun');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur']), UrunController.getAll);

router.post('/', [
    authorize(['admin']),
    validateRequest(urunSchema)
], UrunController.create);

router.get('/:id', authorize(['admin', 'mudur']), UrunController.getById);

router.put('/:id', [
    authorize(['admin']),
    validateRequest(urunSchema)
], UrunController.update);

router.delete('/:id', authorize(['admin']), UrunController.delete);

// Özel işlemler
router.put('/:id/durum', [
    authorize(['admin']),
    validateRequest(urunDurumSchema)
], UrunController.updateDurum);

router.put('/:id/fiyat', [
    authorize(['admin']),
    validateRequest(urunFiyatSchema)
], UrunController.updateFiyat);

router.put('/:id/stok', [
    authorize(['admin']),
    validateRequest(urunStokSchema)
], UrunController.updateStok);

router.post('/:id/resim', [
    authorize(['admin']),
    validateRequest(urunResimSchema)
], UrunController.updateResim);

router.put('/toplu-guncelle', [
    authorize(['admin']),
    validateRequest(urunTopluGuncellemeSchema)
], UrunController.topluGuncelle);

// Listeleme işlemleri
router.get('/kategori/:kategoriId', authorize(['admin', 'mudur']), UrunController.getByKategori);
router.get('/stok-durum/:durum', authorize(['admin', 'mudur']), UrunController.getByStokDurumu);
router.get('/:id/fiyat-gecmisi', authorize(['admin', 'mudur']), UrunController.getFiyatGecmisi);
router.get('/:id/stok-hareketleri', authorize(['admin', 'mudur']), UrunController.getStokHareketleri);
router.get('/:id/satis-istatistikleri', authorize(['admin', 'mudur']), UrunController.getSatisIstatistikleri);

module.exports = router;