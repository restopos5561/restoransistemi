const express = require('express');
const router = express.Router();
const ReceteController = require('../controllers/ReceteController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    receteSchema,
    receteMalzemeSchema,
    receteDurumSchema,
    receteKopyalaSchema
} = require('../validations/recete');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur', 'asci']), ReceteController.getAll);

router.post('/', [
    authorize(['admin', 'mudur']),
    validateRequest(receteSchema)
], ReceteController.create);

router.get('/:id', authorize(['admin', 'mudur', 'asci']), ReceteController.getById);

router.put('/:id', [
    authorize(['admin', 'mudur']),
    validateRequest(receteSchema)
], ReceteController.update);

router.delete('/:id', authorize(['admin']), ReceteController.delete);

// Özel işlemler
router.put('/:id/malzeme', [
    authorize(['admin', 'mudur']),
    validateRequest(receteMalzemeSchema)
], ReceteController.updateMalzemeler);

router.put('/:id/durum', [
    authorize(['admin', 'mudur']),
    validateRequest(receteDurumSchema)
], ReceteController.updateDurum);

router.post('/:id/kopyala', [
    authorize(['admin', 'mudur']),
    validateRequest(receteKopyalaSchema)
], ReceteController.kopyala);

// Listeleme işlemleri
router.get('/urun/:urunId', authorize(['admin', 'mudur', 'asci']), ReceteController.getByUrun);
router.get('/kategori/:kategoriId', authorize(['admin', 'mudur', 'asci']), ReceteController.getByKategori);
router.get('/malzeme/:malzemeId', authorize(['admin', 'mudur', 'asci']), ReceteController.getByMalzeme);
router.get('/:id/maliyet', authorize(['admin', 'mudur']), ReceteController.getMaliyet);
router.get('/:id/gecmis', authorize(['admin', 'mudur']), ReceteController.getGecmis);

module.exports = router; 