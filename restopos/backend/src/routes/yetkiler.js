const express = require('express');
const router = express.Router();
const YetkiController = require('../controllers/YetkiController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const Joi = require('joi');

// Apply authentication to all routes
router.use(authenticateToken);

// Yetki listesi
router.get('/', [
    authorize(['admin', 'mudur']),
    validateRequest(Joi.object({
        modul: Joi.string()
            .messages({
                'string.base': 'Modül metin olmalıdır'
            }),
        rol_id: Joi.number().integer()
            .messages({
                'number.base': 'Rol ID sayı olmalıdır',
                'number.integer': 'Rol ID tam sayı olmalıdır'
            })
    }))
], YetkiController.getYetkiler);

// Yetki detayı
router.get('/:id', [
    authorize(['admin', 'mudur'])
], YetkiController.getYetkiDetay);

// Yetki oluştur
router.post('/', [
    authorize(['admin']),
    validateRequest(Joi.object({
        kod: Joi.string().required()
            .messages({
                'string.base': 'Yetki kodu metin olmalıdır',
                'any.required': 'Yetki kodu zorunludur'
            }),
        ad: Joi.string().required()
            .messages({
                'string.base': 'Yetki adı metin olmalıdır',
                'any.required': 'Yetki adı zorunludur'
            }),
        aciklama: Joi.string()
            .messages({
                'string.base': 'Açıklama metin olmalıdır'
            }),
        modul: Joi.string().required()
            .messages({
                'string.base': 'Modül metin olmalıdır',
                'any.required': 'Modül zorunludur'
            }),
        islemler: Joi.array().items(
            Joi.string().valid('Görüntüleme', 'Ekleme', 'Düzenleme', 'Silme', 'Özel')
        ).required()
            .messages({
                'array.base': 'İşlemler dizi olmalıdır',
                'any.required': 'İşlemler zorunludur',
                'any.only': 'Geçerli işlem tipleri: Görüntüleme, Ekleme, Düzenleme, Silme, Özel'
            })
    }))
], YetkiController.createYetki);

// Yetki güncelle
router.put('/:id', [
    authorize(['admin']),
    validateRequest(Joi.object({
        kod: Joi.string()
            .messages({
                'string.base': 'Yetki kodu metin olmalıdır'
            }),
        ad: Joi.string()
            .messages({
                'string.base': 'Yetki adı metin olmalıdır'
            }),
        aciklama: Joi.string()
            .messages({
                'string.base': 'Açıklama metin olmalıdır'
            }),
        modul: Joi.string()
            .messages({
                'string.base': 'Modül metin olmalıdır'
            }),
        islemler: Joi.array().items(
            Joi.string().valid('Görüntüleme', 'Ekleme', 'Düzenleme', 'Silme', 'Özel')
        )
            .messages({
                'array.base': 'İşlemler dizi olmalıdır',
                'any.only': 'Geçerli işlem tipleri: Görüntüleme, Ekleme, Düzenleme, Silme, Özel'
            })
    }))
], YetkiController.updateYetki);

// Yetki sil
router.delete('/:id', [
    authorize(['admin'])
], YetkiController.deleteYetki);

// Rol yetki ata
router.post('/rol-yetki', [
    authorize(['admin']),
    validateRequest(Joi.object({
        rol_id: Joi.number().integer().required()
            .messages({
                'number.base': 'Rol ID sayı olmalıdır',
                'number.integer': 'Rol ID tam sayı olmalıdır',
                'any.required': 'Rol ID zorunludur'
            }),
        yetki_id: Joi.number().integer().required()
            .messages({
                'number.base': 'Yetki ID sayı olmalıdır',
                'number.integer': 'Yetki ID tam sayı olmalıdır',
                'any.required': 'Yetki ID zorunludur'
            })
    }))
], YetkiController.assignRolYetki);

// Rol yetki kaldır
router.delete('/rol-yetki', [
    authorize(['admin']),
    validateRequest(Joi.object({
        rol_id: Joi.number().integer().required()
            .messages({
                'number.base': 'Rol ID sayı olmalıdır',
                'number.integer': 'Rol ID tam sayı olmalıdır',
                'any.required': 'Rol ID zorunludur'
            }),
        yetki_id: Joi.number().integer().required()
            .messages({
                'number.base': 'Yetki ID sayı olmalıdır',
                'number.integer': 'Yetki ID tam sayı olmalıdır',
                'any.required': 'Yetki ID zorunludur'
            })
    }))
], YetkiController.removeRolYetki);

// Rol yetkileri
router.get('/rol/:rol_id/yetkiler', [
    authorize(['admin', 'mudur'])
], YetkiController.getRolYetkiler);

// Modül yetkileri
router.get('/modul/:modul/yetkiler', [
    authorize(['admin', 'mudur'])
], YetkiController.getModulYetkiler);

module.exports = router;