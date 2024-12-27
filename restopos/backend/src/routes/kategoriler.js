const express = require('express');
const router = express.Router();
const KategoriController = require('../controllers/KategoriController');
const validateRequest = require('../middleware/validateRequest');
const kategoriSchema = require('../validations/kategori');

// Tüm kategorileri getir
router.get('/', KategoriController.getAll);

// Kategori detayı
router.get('/:id', KategoriController.getById);

// Kategoriye ait ürünler
router.get('/:id/urunler', KategoriController.getUrunler);

// Yeni kategori oluştur
router.post('/',
    validateRequest(kategoriSchema.create),
    KategoriController.create
);

// Kategori güncelle
router.put('/:id',
    validateRequest(kategoriSchema.update),
    KategoriController.update
);

// Kategori sil
router.delete('/:id', KategoriController.delete);

module.exports = router;