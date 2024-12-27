const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/UploadController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { 
    uploadSchema,
    uploadTipSchema,
    uploadSilSchema
} = require('../validations/upload');

// Apply authentication to all routes
router.use(authenticateToken);

// Ana işlemler
router.post('/', [
    authorize(['admin', 'mudur']),
    validateRequest(uploadSchema)
], UploadController.upload);

router.post('/tip', [
    authorize(['admin', 'mudur']),
    validateRequest(uploadTipSchema)
], UploadController.uploadByType);

router.delete('/:id', [
    authorize(['admin']),
    validateRequest(uploadSilSchema)
], UploadController.delete);

// Listeleme işlemleri
router.get('/', authorize(['admin', 'mudur']), UploadController.getAll);
router.get('/:id', authorize(['admin', 'mudur']), UploadController.getById);
router.get('/tip/:tip', authorize(['admin', 'mudur']), UploadController.getByType);

module.exports = router;