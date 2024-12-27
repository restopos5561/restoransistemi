const express = require('express');
const router = express.Router();
const StokHareketiController = require('../controllers/StokHareketiController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
  createStokHareketSchema,
  updateStokHareketSchema,
  stokHareketTarihSchema
} = require('../validations/stok-hareketi');

// Apply authentication to all routes
router.use(authenticateToken);

// Tüm stok hareketlerini listele
router.get('/', authorize(['admin', 'mudur']), StokHareketiController.getAll);

// Yeni stok hareketi oluştur
router.post('/',
  authorize(['admin']),
  validateRequest(createStokHareketSchema),
  StokHareketiController.create
);

// Belirli bir stok hareketini getir
router.get('/:id', authorize(['admin', 'mudur']), StokHareketiController.getById);

// Belirli bir stok hareketini güncelle
router.put('/:id',
  authorize(['admin']),
  validateRequest(updateStokHareketSchema),
  StokHareketiController.update
);

// Belirli bir stok hareketini sil
router.delete('/:id', authorize(['admin']), StokHareketiController.delete);

// Tarih aralığına göre stok hareketlerini getir
router.get('/tarih',
  authorize(['admin', 'mudur']),
  validateRequest(stokHareketTarihSchema),
  StokHareketiController.getByDateRange
);

// Ürüne göre stok hareketlerini getir
router.get('/urun/:urunId', authorize(['admin', 'mudur']), StokHareketiController.getByUrun);

// Depoya göre stok hareketlerini getir
router.get('/depo/:depoId', authorize(['admin', 'mudur']), StokHareketiController.getByDepo);

module.exports = router;