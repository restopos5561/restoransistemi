const express = require('express');
const router = express.Router();
const KasaHareketiController = require('../controllers/KasaHareketiController');
const kasaHareketiSchema = require('../validations/kasa-hareketi');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

// Apply authentication to all routes
router.use(authenticateToken);

// Tüm kasa hareketlerini listele
router.get('/', authorize(['admin', 'mudur']), KasaHareketiController.getAll);

// Yeni kasa hareketi oluştur
router.post('/',
  authorize(['admin']),
  validateRequest(kasaHareketiSchema.createKasaHareketiSchema),
  KasaHareketiController.create
);

// Tarih aralığına göre kasa hareketlerini getir
router.get('/tarih-aralik',
  authorize(['admin', 'mudur']),
  validateRequest(kasaHareketiSchema.kasaHareketTarihSchema),
  KasaHareketiController.getByDateRange
);

// Kasaya göre hareketleri getir
router.get('/kasa/:kasaId', 
  authorize(['admin', 'mudur']), 
  KasaHareketiController.getByKasa
);

// Kullanıcıya göre hareketleri getir
router.get('/kullanici/:kullaniciId', 
  authorize(['admin', 'mudur']), 
  KasaHareketiController.getByKullanici
);

// Belirli bir kasa hareketini getir
router.get('/:id', 
  authorize(['admin', 'mudur']), 
  KasaHareketiController.getById
);

// Belirli bir kasa hareketini güncelle
router.put('/:id',
  authorize(['admin']),
  validateRequest(kasaHareketiSchema.updateKasaHareketiSchema),
  KasaHareketiController.update
);

// Belirli bir kasa hareketini sil
router.delete('/:id', 
  authorize(['admin']), 
  KasaHareketiController.delete
);

module.exports = router;