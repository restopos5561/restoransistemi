const express = require('express');
const router = express.Router();
const MasaController = require('../controllers/MasaController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    masaSchema,
    masaDurumSchema,
    masaBirlestirSchema,
    masaTasiSchema,
    masaAyirSchema,
    masaRezervasyonSchema
} = require('../validations/masa');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur']), MasaController.getAll);

router.post('/', [
    authorize(['admin']),
    validateRequest(masaSchema)
], MasaController.create);

router.get('/:id', authorize(['admin', 'mudur']), MasaController.getById);

router.put('/:id', [
    authorize(['admin']),
    validateRequest(masaSchema)
], MasaController.update);

router.delete('/:id', authorize(['admin']), MasaController.delete);

// Özel işlemler
router.put('/:id/durum', [
    authorize(['admin', 'mudur']),
    validateRequest(masaDurumSchema)
], MasaController.updateDurum);

router.post('/birlestir', [
    authorize(['admin', 'mudur']),
    validateRequest(masaBirlestirSchema)
], MasaController.birlestir);

router.post('/:id/tasi', [
    authorize(['admin', 'mudur']),
    validateRequest(masaTasiSchema)
], MasaController.tasi);

router.post('/:id/ayir', [
    authorize(['admin', 'mudur']),
    validateRequest(masaAyirSchema)
], MasaController.ayir);

// Rezervasyon işlemleri
router.post('/:id/rezervasyon', [
    authorize(['admin', 'mudur']),
    validateRequest(masaRezervasyonSchema)
], MasaController.rezervasyonYap);

router.get('/:id/rezervasyonlar', authorize(['admin', 'mudur']), MasaController.getRezervasyonlar);

// Listeleme işlemleri
router.get('/bolge/:bolgeId', authorize(['admin', 'mudur']), MasaController.getByBolge);
router.get('/durum/:durum', authorize(['admin', 'mudur']), MasaController.getByDurum);
router.get('/:id/adisyonlar', authorize(['admin', 'mudur']), MasaController.getAdisyonlar);
router.get('/:id/istatistikler', authorize(['admin', 'mudur']), MasaController.getIstatistikler);

module.exports = router;