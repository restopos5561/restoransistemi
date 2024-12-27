const express = require('express');
const router = express.Router();
const StokUyariController = require('../controllers/StokUyariController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
  createStokUyariSchema,
  updateStokUyariSchema
} = require('../validations/stok-uyari');

// Apply authentication to all routes
router.use(authenticateToken);

// Tüm stok uyarılarını listele
router.get('/', authorize(['admin', 'mudur']), StokUyariController.getAll);

// Yeni stok uyarısı oluştur
router.post('/',
  authorize(['admin']),
  validateRequest(createStokUyariSchema),
  StokUyariController.create
);

// Belirli bir stok uyarısını getir
router.get('/:id', authorize(['admin', 'mudur']), StokUyariController.getById);

// Belirli bir stok uyarısını güncelle
router.put('/:id',
  authorize(['admin']),
  validateRequest(updateStokUyariSchema),
  StokUyariController.update
);

// Belirli bir stok uyarısını sil
router.delete('/:id', authorize(['admin']), StokUyariController.delete);

module.exports = router;