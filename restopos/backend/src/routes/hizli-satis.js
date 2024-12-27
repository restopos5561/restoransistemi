const express = require('express');
const router = express.Router();
const HizliSatisController = require('../controllers/HizliSatisController');
const validateRequest = require('../middleware/validateRequest');
const hizliSatisSchema = require('../validations/hizli-satis');

// Hızlı satış oluşturma
router.post('/', 
    validateRequest(hizliSatisSchema.create),
    HizliSatisController.create
);

// Hızlı satış güncelleme
router.put('/:id', 
    validateRequest(hizliSatisSchema.update),
    HizliSatisController.update
);

// Hızlı satış silme
router.delete('/:id', HizliSatisController.delete);

// Hızlı satış detayı
router.get('/:id', HizliSatisController.getById);

// Kategoriye göre hızlı satışlar
router.get('/kategori/:kategori_id',
    validateRequest(hizliSatisSchema.getByKategori),
    HizliSatisController.getByKategori
);

// Kullanıcıya göre hızlı satışlar
router.get('/kullanici/:kullanici_id',
    validateRequest(hizliSatisSchema.getByKullanici),
    HizliSatisController.getByKullanici
);

// Tarihe göre hızlı satışlar
router.post('/tarih',
    validateRequest(hizliSatisSchema.getByTarih),
    HizliSatisController.getByTarih
);

// İstatistikler
router.post('/istatistikler',
    validateRequest(hizliSatisSchema.getIstatistikler),
    HizliSatisController.getIstatistikler
);

// Özet bilgi
router.get('/:id/ozet', HizliSatisController.getOzet);

// Fiş yazdırma
router.post('/:id/fis',
    validateRequest(hizliSatisSchema.fisYazdir),
    HizliSatisController.fisYazdir
);

// İndirim uygulama
router.post('/:id/indirim',
    validateRequest(hizliSatisSchema.indirimUygula),
    HizliSatisController.indirimUygula
);

// İkram uygulama
router.post('/:id/ikram',
    validateRequest(hizliSatisSchema.ikramUygula),
    HizliSatisController.ikramUygula
);

// Durum güncelleme
router.put('/:id/durum',
    validateRequest(hizliSatisSchema.updateDurum),
    HizliSatisController.updateDurum
);

module.exports = router;