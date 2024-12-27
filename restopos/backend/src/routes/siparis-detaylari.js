const express = require('express');
const router = express.Router();
const SiparisDetayController = require('../controllers/SiparisDetayController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
  createSiparisDetaySchema,
  updateSiparisDetaySchema,
  updateDurumSchema,
  updateNotSchema
} = require('../validations/siparis-detay');

// Apply authentication to all routes
router.use(authenticateToken);

// Tüm sipariş detaylarını listele
router.get('/', authorize(['admin', 'mudur']), SiparisDetayController.getAll);

// Yeni sipariş detayı oluştur
router.post('/',
  authorize(['admin']),
  validateRequest(createSiparisDetaySchema),
  SiparisDetayController.create
);

// Belirli bir sipariş detayını getir
router.get('/:id', authorize(['admin', 'mudur']), SiparisDetayController.getById);

// Belirli bir sipariş detayını güncelle
router.put('/:id',
  authorize(['admin']),
  validateRequest(updateSiparisDetaySchema),
  SiparisDetayController.update
);

// Belirli bir sipariş detayını sil
router.delete('/:id', authorize(['admin']), SiparisDetayController.delete);

// Sipariş detayı durumunu güncelle
router.put('/:id/durum',
  authorize(['admin']),
  validateRequest(updateDurumSchema),
  SiparisDetayController.updateDurum
);

// Sipariş detayı notunu güncelle
router.put('/:id/not',
  authorize(['admin']),
  validateRequest(updateNotSchema),
  SiparisDetayController.updateNot
);

// Siparişe göre detayları getir
router.get('/siparis/:siparisId', authorize(['admin', 'mudur']), SiparisDetayController.getBySiparis);

// Ürüne göre detayları getir
router.get('/urun/:urunId', authorize(['admin', 'mudur']), SiparisDetayController.getByUrun);

module.exports = router;