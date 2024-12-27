const express = require('express');
const router = express.Router();
const RolController = require('../controllers/RolController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const Joi = require('joi');

// Global auth middleware
router.use(authenticateToken);

// Rol listesi
router.get('/', [
    authorize(['admin', 'mudur']),
    validateRequest(Joi.object({
        durum: Joi.string().valid('Aktif', 'Pasif')
            .messages({
                'string.base': 'Durum metin olmalıdır',
                'any.only': 'Geçerli bir durum seçiniz'
            })
    }))
], RolController.getAll);

// Rol detayı
router.get('/:id', authorize(['admin', 'mudur']), RolController.getById);

// Rol oluştur
router.post('/', [
    authorize(['admin']),
    validateRequest(Joi.object({
        kod: Joi.string().required()
            .messages({
                'string.base': 'Rol kodu metin olmalıdır',
                'any.required': 'Rol kodu zorunludur'
            }),
        ad: Joi.string().required()
            .messages({
                'string.base': 'Rol adı metin olmalıdır',
                'any.required': 'Rol adı zorunludur'
            }),
        aciklama: Joi.string()
            .messages({
                'string.base': 'Açıklama metin olmalıdır'
            }),
        durum: Joi.string().valid('Aktif', 'Pasif').default('Aktif')
            .messages({
                'string.base': 'Durum metin olmalıdır',
                'any.only': 'Geçerli bir durum seçiniz'
            }),
        yetki_listesi: Joi.array().items(Joi.number().integer())
            .messages({
                'array.base': 'Yetki listesi dizi olmalıdır',
                'number.base': 'Yetki ID sayı olmalıdır',
                'number.integer': 'Yetki ID tam sayı olmalıdır'
            })
    }))
], RolController.create);

// Rol güncelle
router.put('/:id', [
    authorize(['admin']),
    validateRequest(Joi.object({
        kod: Joi.string()
            .messages({
                'string.base': 'Rol kodu metin olmalıdır'
            }),
        ad: Joi.string()
            .messages({
                'string.base': 'Rol adı metin olmalıdır'
            }),
        aciklama: Joi.string()
            .messages({
                'string.base': 'Açıklama metin olmalıdır'
            }),
        durum: Joi.string().valid('Aktif', 'Pasif')
            .messages({
                'string.base': 'Durum metin olmalıdır',
                'any.only': 'Geçerli bir durum seçiniz'
            }),
        yetki_listesi: Joi.array().items(Joi.number().integer())
            .messages({
                'array.base': 'Yetki listesi dizi olmalıdır',
                'number.base': 'Yetki ID sayı olmalıdır',
                'number.integer': 'Yetki ID tam sayı olmalıdır'
            })
    }))
], RolController.update);

// Rol sil
router.delete('/:id', authorize(['admin']), RolController.delete);

// Rol durumu güncelle
router.patch('/:id/durum', [
    authorize(['admin']),
    validateRequest(Joi.object({
        durum: Joi.string().valid('Aktif', 'Pasif').required()
            .messages({
                'string.base': 'Durum metin olmalıdır',
                'any.only': 'Geçerli bir durum seçiniz',
                'any.required': 'Durum zorunludur'
            })
    }))
], RolController.updateDurum);

// Rol yetkileri güncelle
router.put('/:id/yetkiler', [
    authorize(['admin']),
    validateRequest(Joi.object({
        yetki_listesi: Joi.array().items(Joi.number().integer()).required()
            .messages({
                'array.base': 'Yetki listesi dizi olmalıdır',
                'number.base': 'Yetki ID sayı olmalıdır',
                'number.integer': 'Yetki ID tam sayı olmalıdır',
                'any.required': 'Yetki listesi zorunludur'
            })
    }))
], RolController.addYetki);

// Rol yetkileri
router.get('/:id/yetkiler', authorize(['admin', 'mudur']), RolController.getYetkiler);

module.exports = router;