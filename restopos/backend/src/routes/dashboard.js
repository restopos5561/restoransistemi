const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    dashboardTarihSchema,
    dashboardKarsilastirmaSchema
} = require('../validations/dashboard');

// Apply authentication to all routes
router.use(authenticateToken);

// Genel istatistikler
router.get('/ozet', authorize(['admin', 'mudur']), DashboardController.getOzet);
router.get('/gunluk', authorize(['admin', 'mudur']), DashboardController.getGunlukOzet);
router.get('/haftalik', authorize(['admin', 'mudur']), DashboardController.getHaftalikOzet);
router.get('/aylik', authorize(['admin', 'mudur']), DashboardController.getAylikOzet);

// Detaylı istatistikler
router.get('/satis', authorize(['admin', 'mudur']), DashboardController.getSatisIstatistikleri);
router.get('/urun', authorize(['admin', 'mudur']), DashboardController.getUrunIstatistikleri);
router.get('/personel', authorize(['admin', 'mudur']), DashboardController.getPersonelIstatistikleri);
router.get('/musteri', authorize(['admin', 'mudur']), DashboardController.getMusteriIstatistikleri);
router.get('/masa', authorize(['admin', 'mudur']), DashboardController.getMasaIstatistikleri);
router.get('/kurye', authorize(['admin', 'mudur']), DashboardController.getKuryeIstatistikleri);

// Tarih bazlı istatistikler
router.get('/tarih', [
    authorize(['admin', 'mudur']),
    validateRequest(dashboardTarihSchema)
], DashboardController.getByTarihAralik);

// Karşılaştırmalı istatistikler
router.get('/karsilastirma', [
    authorize(['admin', 'mudur']),
    validateRequest(dashboardKarsilastirmaSchema)
], DashboardController.getKarsilastirma);

// Canlı istatistikler
router.get('/canli', authorize(['admin', 'mudur']), DashboardController.getCanliIstatistikler);
router.get('/canli/siparisler', authorize(['admin', 'mudur']), DashboardController.getCanliSiparisler);
router.get('/canli/masalar', authorize(['admin', 'mudur']), DashboardController.getCanliMasaDurumu);
router.get('/canli/mutfak', authorize(['admin', 'mudur']), DashboardController.getCanliMutfakDurumu);
router.get('/canli/kuryeler', authorize(['admin', 'mudur']), DashboardController.getCanliKuryeDurumu);

module.exports = router; 