const express = require('express');
const router = express.Router();

// Route'ları içe aktar
const authRouter = require('./auth');
const adisyonlarRouter = require('./adisyonlar');
const adisyonKalemleriRouter = require('./adisyon-kalemleri');
const ayarlarRouter = require('./ayarlar');
const bolgelerRouter = require('./bolgeler');
const carilerRouter = require('./cariler');
const dashboardRouter = require('./dashboard');
const fiyatDegisiklikLogRouter = require('./fiyat-degisiklik-log');
const hizliSatisRouter = require('./hizli-satis');
const kasaHareketleriRouter = require('./kasa-hareketleri');
const kategorilerRouter = require('./kategoriler');
const kullanicilarRouter = require('./kullanicilar');
const kuryelerRouter = require('./kuryeler');
const lisanslarRouter = require('./lisanslar');
const masalarRouter = require('./masalar');
const mutfakRouter = require('./mutfak');
const odemelerRouter = require('./odemeler');
const paketSiparislerRouter = require('./paket-siparisler');
const raporlarRouter = require('./raporlar');
const recetelerRouter = require('./receteler');
const rezervasyonlarRouter = require('./rezervasyonlar');
const rollerRouter = require('./roller');
const siparislerRouter = require('./siparisler');
const siparisDetaylariRouter = require('./siparis-detaylari');
const siparisDurumGecmisiRouter = require('./siparis-durum-gecmisi');
const stoklarRouter = require('./stoklar');
const stokHareketleriRouter = require('./stok-hareketleri');
const stokUyarilariRouter = require('./stok-uyarilari');
const uploadRouter = require('./upload');
const urunlerRouter = require('./urunler');
const yetkilerRouter = require('./yetkiler');

// Route'ları tanımla
router.use('/auth', authRouter);
router.use('/adisyonlar', adisyonlarRouter);
router.use('/adisyon-kalemleri', adisyonKalemleriRouter);
router.use('/ayarlar', ayarlarRouter);
router.use('/bolgeler', bolgelerRouter);
router.use('/cariler', carilerRouter);
router.use('/dashboard', dashboardRouter);
router.use('/fiyat-degisiklik-log', fiyatDegisiklikLogRouter);
router.use('/hizli-satis', hizliSatisRouter);
router.use('/kasa-hareketleri', kasaHareketleriRouter);
router.use('/kategoriler', kategorilerRouter);
router.use('/kullanicilar', kullanicilarRouter);
router.use('/kuryeler', kuryelerRouter);
router.use('/lisanslar', lisanslarRouter);
router.use('/masalar', masalarRouter);
router.use('/mutfak', mutfakRouter);
router.use('/odemeler', odemelerRouter);
router.use('/paket-siparisler', paketSiparislerRouter);
router.use('/raporlar', raporlarRouter);
router.use('/receteler', recetelerRouter);
router.use('/rezervasyonlar', rezervasyonlarRouter);
router.use('/roller', rollerRouter);
router.use('/siparisler', siparislerRouter);
router.use('/siparis-detaylari', siparisDetaylariRouter);
router.use('/siparis-durum-gecmisi', siparisDurumGecmisiRouter);
router.use('/stoklar', stoklarRouter);
router.use('/stok-hareketleri', stokHareketleriRouter);
router.use('/stok-uyarilari', stokUyarilariRouter);
router.use('/upload', uploadRouter);
router.use('/urunler', urunlerRouter);
router.use('/yetkiler', yetkilerRouter);

// Ana route
router.get('/', (req, res) => {
    res.json({
        message: 'RestoPOS API',
        version: '1.0.0',
        status: 'active'
    });
});

// 404 handler
router.use((req, res) => {
    res.status(404).json({
        error: 'Route bulunamadı'
    });
});

// Error handler
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Sunucu hatası'
    });
});

module.exports = router; 