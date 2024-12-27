const express = require('express');
const router = express.Router();
const AdisyonController = require('../controllers/AdisyonController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    adisyonSchema, 
    adisyonUpdateSchema,
    adisyonDurumSchema,
    adisyonUrunSchema,
    adisyonIndirimSchema,
    adisyonOdemeSchema,
    adisyonIptalSchema,
    adisyonTarihSchema
} = require('../validations/adisyon');

// Tüm route'lar için authentication
router.use(authenticateToken);

// Listeleme işlemleri (özel route'lar)
router.get('/masa/:masaId', authorize(['admin', 'mudur']), AdisyonController.getByMasa);
router.get('/musteri/:musteriId', authorize(['admin', 'mudur']), AdisyonController.getByMusteri);
router.get('/personel/:personelId', authorize(['admin', 'mudur']), AdisyonController.getByPersonel);
router.get('/tarih-aralik', [
    authorize(['admin', 'mudur']),
    validateRequest(adisyonTarihSchema)
], AdisyonController.getByTarihAralik);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur']), AdisyonController.getAll);
router.post('/', [
    authorize(['admin']),
    validateRequest(adisyonSchema)
], AdisyonController.create);
router.get('/:id', authorize(['admin', 'mudur']), AdisyonController.getById);
router.put('/:id', [
    authorize(['admin']),
    validateRequest(adisyonUpdateSchema)
], AdisyonController.update);
router.delete('/:id', authorize(['admin']), AdisyonController.delete);

// Özel işlemler
router.put('/:id/durum', [
    authorize(['admin', 'mudur']),
    validateRequest(adisyonDurumSchema)
], AdisyonController.updateDurum);

router.post('/:id/urun', [
    authorize(['admin', 'mudur']),
    validateRequest(adisyonUrunSchema)
], AdisyonController.addUrun);

router.delete('/:id/urun/:urunId', authorize(['admin', 'mudur']), AdisyonController.removeUrun);

router.post('/:id/indirim', [
    authorize(['admin']),
    validateRequest(adisyonIndirimSchema)
], AdisyonController.indirimUygula);

router.post('/:id/odeme', [
    authorize(['admin', 'mudur']),
    validateRequest(adisyonOdemeSchema)
], AdisyonController.odemeEkle);

router.delete('/:id/odeme/:odemeId', authorize(['admin']), AdisyonController.odemeSil);

// Diğer işlemler
router.post('/:id/yazdir', authorize(['admin', 'mudur']), AdisyonController.yazdir);
router.post('/:id/kapat', authorize(['admin', 'mudur']), AdisyonController.kapat);
router.post('/:id/iptal', [
    authorize(['admin']),
    validateRequest(adisyonIptalSchema)
], AdisyonController.iptalEt);

module.exports = router;