const express = require('express');
const router = express.Router();
const StokController = require('../controllers/StokController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
  createStokSchema, 
  updateStokSchema,
  stokHareketSchema 
} = require('../validations/stok');

// Apply authentication to all routes
router.use(authenticateToken);

// Tüm stokları listele
router.get('/', 
  authorize(['admin', 'mudur']), 
  StokController.getAll
);

// Yeni stok kaydı oluştur
router.post('/',
  authorize(['admin']),
  validateRequest(createStokSchema),
  StokController.create
);

// Belirli bir stok kaydını getir
router.get('/:id',
  authorize(['admin', 'mudur']),
  StokController.getById
);

// Belirli bir stok kaydını güncelle
router.put('/:id',
  authorize(['admin']),
  validateRequest(updateStokSchema),
  StokController.update
);

// Belirli bir stok kaydını sil
router.delete('/:id',
  authorize(['admin']),
  StokController.delete
);

// Stok giriş hareketi ekle
router.post('/:id/giris',
  authorize(['admin']),
  validateRequest(stokHareketSchema),
  StokController.stokGiris
);

// Stok çıkış hareketi ekle
router.post('/:id/cikis',
  authorize(['admin']),
  validateRequest(stokHareketSchema),
  StokController.stokCikis
);

// Stok sayım kaydı ekle
router.post('/:id/sayim',
  authorize(['admin']),
  validateRequest(stokHareketSchema),
  StokController.stokSayim
);

// Kritik stok seviyesindeki ürünleri listele
router.get('/durum/kritik',
  authorize(['admin', 'mudur']),
  StokController.getKritikStoklar
);

// Stok hareket geçmişi
router.get('/:id/hareketler',
  authorize(['admin', 'mudur']),
  StokController.getStokHareketleri
);

module.exports = router;