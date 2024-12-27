const express = require('express');
const router = express.Router();
const FiyatDegisiklikLogController = require('../controllers/FiyatDegisiklikLogController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    fiyatDegisiklikLogSchema,
    fiyatDegisiklikTarihSchema
} = require('../validations/fiyat-degisiklik-log');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur']), FiyatDegisiklikLogController.getAll);

router.post('/', [
    authorize(['admin']),
    validateRequest(fiyatDegisiklikLogSchema)
], FiyatDegisiklikLogController.create);

router.get('/:id', authorize(['admin', 'mudur']), FiyatDegisiklikLogController.getById);

// Listeleme işlemleri
router.get('/urun/:urunId', authorize(['admin', 'mudur']), FiyatDegisiklikLogController.getByUrun);

router.get('/tarih', [
    authorize(['admin', 'mudur']),
    validateRequest(fiyatDegisiklikTarihSchema)
], FiyatDegisiklikLogController.getByTarihAralik);

router.get('/kullanici/:kullaniciId', authorize(['admin', 'mudur']), FiyatDegisiklikLogController.getByKullanici);
router.get('/kategori/:kategoriId', authorize(['admin', 'mudur']), FiyatDegisiklikLogController.getByKategori);
router.get('/istatistikler', authorize(['admin', 'mudur']), FiyatDegisiklikLogController.getIstatistikler);

module.exports = router;