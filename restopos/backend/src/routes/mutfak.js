const express = require('express');
const router = express.Router();
const MutfakController = require('../controllers/MutfakController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    mutfakSiparisSchema,
    mutfakDurumSchema,
    mutfakNotSchema,
    mutfakOncelikSchema,
    mutfakTarihSchema
} = require('../validations/mutfak');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur', 'asci']), MutfakController.getAll);

router.post('/', [
    authorize(['admin', 'mudur', 'asci']),
    validateRequest(mutfakSiparisSchema)
], MutfakController.create);

router.get('/:id', authorize(['admin', 'mudur', 'asci']), MutfakController.getById);

router.put('/:id', [
    authorize(['admin', 'mudur', 'asci']),
    validateRequest(mutfakSiparisSchema)
], MutfakController.update);

router.delete('/:id', authorize(['admin']), MutfakController.delete);

// Özel işlemler
router.put('/:id/durum', [
    authorize(['admin', 'mudur', 'asci']),
    validateRequest(mutfakDurumSchema)
], MutfakController.updateDurum);

router.put('/:id/not', [
    authorize(['admin', 'mudur', 'asci']),
    validateRequest(mutfakNotSchema)
], MutfakController.updateNot);

router.put('/:id/oncelik', [
    authorize(['admin', 'mudur', 'asci']),
    validateRequest(mutfakOncelikSchema)
], MutfakController.updateOncelik);

// Listeleme işlemleri
router.get('/tarih', [
    authorize(['admin', 'mudur', 'asci']),
    validateRequest(mutfakTarihSchema)
], MutfakController.getByTarihAralik);

router.get('/aktif', authorize(['admin', 'mudur', 'asci']), MutfakController.getAktifSiparisler);
router.get('/bekleyen', authorize(['admin', 'mudur', 'asci']), MutfakController.getBekleyenSiparisler);
router.get('/tamamlanan', authorize(['admin', 'mudur', 'asci']), MutfakController.getTamamlananSiparisler);
router.get('/iptal', authorize(['admin', 'mudur', 'asci']), MutfakController.getIptalEdilenSiparisler);

router.get('/kategori/:kategoriId', authorize(['admin', 'mudur', 'asci']), MutfakController.getByKategori);
router.get('/masa/:masaId', authorize(['admin', 'mudur', 'asci']), MutfakController.getByMasa);
router.get('/personel/:personelId', authorize(['admin', 'mudur', 'asci']), MutfakController.getByPersonel);

// İstatistikler
router.get('/istatistikler', authorize(['admin', 'mudur']), MutfakController.getIstatistikler);
router.get('/performans', authorize(['admin', 'mudur']), MutfakController.getPerformansRaporu);

module.exports = router;