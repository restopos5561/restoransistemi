const express = require('express');
const router = express.Router();
const RaporController = require('../controllers/RaporController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    satisRaporuSchema,
    urunRaporuSchema,
    personelRaporuSchema,
    musteriRaporuSchema,
    masaRaporuSchema,
    kuryeRaporuSchema,
    karsilastirmaRaporuSchema,
    raporFormatSchema,
    raporSablonSchema
} = require('../validations/rapor');

// Apply authentication to all routes
router.use(authenticateToken);

// Genel raporlar
router.get('/satis', [
    authorize(['admin', 'mudur']),
    validateRequest(satisRaporuSchema)
], RaporController.getSatisRaporu);

router.get('/urun', [
    authorize(['admin', 'mudur']),
    validateRequest(urunRaporuSchema)
], RaporController.getUrunRaporu);

router.get('/personel', [
    authorize(['admin', 'mudur']),
    validateRequest(personelRaporuSchema)
], RaporController.getPersonelRaporu);

router.get('/musteri', [
    authorize(['admin', 'mudur']),
    validateRequest(musteriRaporuSchema)
], RaporController.getMusteriRaporu);

router.get('/masa', [
    authorize(['admin', 'mudur']),
    validateRequest(masaRaporuSchema)
], RaporController.getMasaRaporu);

router.get('/kurye', [
    authorize(['admin', 'mudur']),
    validateRequest(kuryeRaporuSchema)
], RaporController.getKuryeRaporu);

// Karşılaştırmalı raporlar
router.get('/karsilastirma', [
    authorize(['admin', 'mudur']),
    validateRequest(karsilastirmaRaporuSchema)
], RaporController.getKarsilastirmaRaporu);

// Özel raporlar
router.get('/stok', authorize(['admin', 'mudur']), RaporController.getStokRaporu);
router.get('/kasa', authorize(['admin', 'mudur']), RaporController.getKasaRaporu);
router.get('/mutfak', authorize(['admin', 'mudur']), RaporController.getMutfakRaporu);
router.get('/rezervasyon', authorize(['admin', 'mudur']), RaporController.getRezervasyonRaporu);

// Rapor formatları
router.post('/format', [
    authorize(['admin', 'mudur']),
    validateRequest(raporFormatSchema)
], RaporController.exportRapor);

// Rapor şablonları
router.get('/sablon', authorize(['admin', 'mudur']), RaporController.getSablonlar);

router.post('/sablon', [
    authorize(['admin']),
    validateRequest(raporSablonSchema)
], RaporController.createSablon);

router.put('/sablon/:id', [
    authorize(['admin']),
    validateRequest(raporSablonSchema)
], RaporController.updateSablon);

router.delete('/sablon/:id', authorize(['admin']), RaporController.deleteSablon);

module.exports = router; 