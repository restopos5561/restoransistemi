const express = require('express');
const router = express.Router();
const PaketSiparisController = require('../controllers/PaketSiparisController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    paketSiparisSchema,
    paketSiparisDurumSchema,
    paketSiparisAdresSchema,
    paketSiparisKuryeSchema,
    paketSiparisIptalSchema,
    paketSiparisTarihSchema
} = require('../validations/paket-siparis');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur']), PaketSiparisController.getAll);

router.post('/', [
    authorize(['admin', 'mudur']),
    validateRequest(paketSiparisSchema)
], PaketSiparisController.create);

router.get('/:id', authorize(['admin', 'mudur']), PaketSiparisController.getById);

router.put('/:id', [
    authorize(['admin', 'mudur']),
    validateRequest(paketSiparisSchema)
], PaketSiparisController.update);

router.delete('/:id', authorize(['admin']), PaketSiparisController.delete);

// Özel işlemler
router.put('/:id/durum', [
    authorize(['admin', 'mudur']),
    validateRequest(paketSiparisDurumSchema)
], PaketSiparisController.updateDurum);

router.put('/:id/adres', [
    authorize(['admin', 'mudur']),
    validateRequest(paketSiparisAdresSchema)
], PaketSiparisController.updateAdres);

router.put('/:id/kurye', [
    authorize(['admin', 'mudur']),
    validateRequest(paketSiparisKuryeSchema)
], PaketSiparisController.updateKurye);

router.post('/:id/iptal', [
    authorize(['admin']),
    validateRequest(paketSiparisIptalSchema)
], PaketSiparisController.iptalEt);

// Listeleme işlemleri
router.get('/tarih', [
    authorize(['admin', 'mudur']),
    validateRequest(paketSiparisTarihSchema)
], PaketSiparisController.getByTarihAralik);

router.get('/aktif', authorize(['admin', 'mudur']), PaketSiparisController.getAktifSiparisler);
router.get('/bekleyen', authorize(['admin', 'mudur']), PaketSiparisController.getBekleyenSiparisler);
router.get('/tamamlanan', authorize(['admin', 'mudur']), PaketSiparisController.getTamamlananSiparisler);
router.get('/iptal', authorize(['admin', 'mudur']), PaketSiparisController.getIptalEdilenSiparisler);

router.get('/musteri/:musteriId', authorize(['admin', 'mudur']), PaketSiparisController.getByMusteri);
router.get('/kurye/:kuryeId', authorize(['admin', 'mudur']), PaketSiparisController.getByKurye);
router.get('/bolge/:bolgeId', authorize(['admin', 'mudur']), PaketSiparisController.getByBolge);

// İstatistikler
router.get('/istatistikler', authorize(['admin', 'mudur']), PaketSiparisController.getIstatistikler);
router.get('/performans', authorize(['admin', 'mudur']), PaketSiparisController.getPerformansRaporu);

module.exports = router;