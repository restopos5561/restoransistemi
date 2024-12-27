const express = require('express');
const router = express.Router();
const RezervasyonController = require('../controllers/RezervasyonController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    rezervasyonSchema,
    rezervasyonDurumSchema,
    rezervasyonIptalSchema,
    rezervasyonTarihSchema,
    rezervasyonNotSchema
} = require('../validations/rezervasyon');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur']), RezervasyonController.getAll);

router.post('/', [
    authorize(['admin', 'mudur']),
    validateRequest(rezervasyonSchema)
], RezervasyonController.create);

router.get('/:id', authorize(['admin', 'mudur']), RezervasyonController.getById);

router.put('/:id', [
    authorize(['admin', 'mudur']),
    validateRequest(rezervasyonSchema)
], RezervasyonController.update);

router.delete('/:id', authorize(['admin']), RezervasyonController.delete);

// Özel işlemler
router.put('/:id/durum', [
    authorize(['admin', 'mudur']),
    validateRequest(rezervasyonDurumSchema)
], RezervasyonController.updateDurum);

router.post('/:id/iptal', [
    authorize(['admin', 'mudur']),
    validateRequest(rezervasyonIptalSchema)
], RezervasyonController.iptalEt);

router.put('/:id/not', [
    authorize(['admin', 'mudur']),
    validateRequest(rezervasyonNotSchema)
], RezervasyonController.updateNot);

// Listeleme işlemleri
router.get('/tarih', [
    authorize(['admin', 'mudur']),
    validateRequest(rezervasyonTarihSchema)
], RezervasyonController.getByTarih);

router.get('/bugun', authorize(['admin', 'mudur']), RezervasyonController.getBugunku);
router.get('/gelecek', authorize(['admin', 'mudur']), RezervasyonController.getGelecek);
router.get('/gecmis', authorize(['admin', 'mudur']), RezervasyonController.getGecmis);

router.get('/masa/:masaId', authorize(['admin', 'mudur']), RezervasyonController.getByMasa);
router.get('/musteri/:musteriId', authorize(['admin', 'mudur']), RezervasyonController.getByMusteri);

// Hatırlatma işlemleri
router.post('/:id/hatirlatma-gonder', authorize(['admin', 'mudur']), RezervasyonController.sendHatirlatmaEmail);
router.get('/hatirlatma-bekleyenler', authorize(['admin', 'mudur']), RezervasyonController.getHatirlatmaBekleyenler);

module.exports = router;