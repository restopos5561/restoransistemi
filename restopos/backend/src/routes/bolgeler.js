const express = require('express');
const router = express.Router();
const BolgeController = require('../controllers/BolgeController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    bolgeSchema,
    bolgeDurumSchema,
    bolgeSiralamaSchema
} = require('../validations/bolge');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana CRUD işlemleri
router.get('/', authorize(['admin', 'mudur']), BolgeController.getAll);

router.post('/', [
    authorize(['admin']),
    validateRequest(bolgeSchema)
], BolgeController.create);

router.get('/:id', authorize(['admin', 'mudur']), BolgeController.getById);

router.put('/:id', [
    authorize(['admin']),
    validateRequest(bolgeSchema)
], BolgeController.update);

router.delete('/:id', authorize(['admin']), BolgeController.delete);

// Özel işlemler
router.put('/:id/durum', [
    authorize(['admin']),
    validateRequest(bolgeDurumSchema)
], BolgeController.updateDurum);

router.put('/:id/siralama', [
    authorize(['admin']),
    validateRequest(bolgeSiralamaSchema)
], BolgeController.updateSiralama);

// Listeleme işlemleri
router.get('/:id/masalar', authorize(['admin', 'mudur']), BolgeController.getMasalar);
router.get('/:id/istatistikler', authorize(['admin', 'mudur']), BolgeController.getIstatistikler);

module.exports = router; 