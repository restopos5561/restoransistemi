const express = require('express');
const router = express.Router();
const KuryeController = require('../controllers/KuryeController');
const validateRequest = require('../middleware/validateRequest');
const kuryeSchema = require('../validations/kurye');

// Tüm kuryeleri getir
router.get('/', KuryeController.getAll);

// Kurye detayı
router.get('/:id', KuryeController.getById);

// Kurye siparişleri
router.get('/:id/siparisler', KuryeController.getSiparisler);

// Yeni kurye oluştur
router.post('/',
    validateRequest(kuryeSchema.create),
    KuryeController.create
);

// Kurye güncelle
router.put('/:id',
    validateRequest(kuryeSchema.update),
    KuryeController.update
);

// Kurye durumu güncelle
router.put('/:id/durum',
    validateRequest(kuryeSchema.updateDurum),
    KuryeController.updateDurum
);

// Kurye sil
router.delete('/:id', KuryeController.delete);

module.exports = router;