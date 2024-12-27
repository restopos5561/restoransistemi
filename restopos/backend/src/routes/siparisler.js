const express = require('express');
const router = express.Router();
const SiparisController = require('../controllers/SiparisController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
  createSiparisSchema,
  updateSiparisSchema,
  updateDurumSchema,
  urunEkleSchema,
  updateDetaySchema,
  updateNotlarSchema
} = require('../validations/siparis');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Tüm siparişleri listele
router.get('/', authorize(['admin', 'mudur']), SiparisController.getAll);

// Yeni sipariş oluştur
router.post('/', 
  authorize(['admin']),
  validateRequest(createSiparisSchema),
  SiparisController.create
);

// Belirli bir siparişi getir
router.get('/:id', authorize(['admin', 'mudur']), SiparisController.getById);

// Belirli bir siparişi güncelle
router.put('/:id',
  authorize(['admin']),
  validateRequest(updateSiparisSchema),
  SiparisController.update
);

// Belirli bir siparişi sil
router.delete('/:id', authorize(['admin']), SiparisController.delete);

// Sipariş durumunu güncelle
router.put('/:id/durum',
  authorize(['admin']),
  validateRequest(updateDurumSchema),
  SiparisController.updateDurum
);

// Siparişe ürün ekle
router.post('/:id/urun',
  authorize(['admin']),
  validateRequest(urunEkleSchema),
  SiparisController.urunEkle
);

// Siparişten ürün çıkar
router.delete('/:id/urun/:urunId', authorize(['admin']), SiparisController.urunCikar);

// Sipariş detaylarını güncelle
router.put('/:id/detay/:detayId',
  authorize(['admin']),
  validateRequest(updateDetaySchema),
  SiparisController.updateDetay
);

// Sipariş notlarını güncelle
router.put('/:id/notlar',
  authorize(['admin']),
  validateRequest(updateNotlarSchema),
  SiparisController.updateNotlar
);

// Sipariş geçmişini getir
router.get('/:id/gecmis', authorize(['admin', 'mudur']), SiparisController.getSiparisGecmisi);

module.exports = router;