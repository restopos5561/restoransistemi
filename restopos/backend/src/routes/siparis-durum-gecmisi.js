const express = require('express');
const router = express.Router();
const SiparisDurumGecmisiController = require('../controllers/SiparisDurumGecmisiController');
const { authenticateToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const Joi = require('joi');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Sipariş durum geçmişi listesi
router.get('/', [
    authorize(['admin', 'mudur']),
    validateRequest(Joi.object({
        siparis_id: Joi.number().integer()
            .messages({
                'number.base': 'Sipariş ID sayı olmalıdır',
                'number.integer': 'Sipariş ID tam sayı olmalıdır'
            }),
        baslangic_tarihi: Joi.date()
            .messages({
                'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır'
            }),
        bitis_tarihi: Joi.date()
            .messages({
                'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır'
            }),
        durum: Joi.string()
            .messages({
                'string.base': 'Durum metin olmalıdır'
            }),
        personel_id: Joi.number().integer()
            .messages({
                'number.base': 'Personel ID sayı olmalıdır',
                'number.integer': 'Personel ID tam sayı olmalıdır'
            })
    }))
], SiparisDurumGecmisiController.getSiparisDurumGecmisi);

// Sipariş durum geçmişi detayı
router.get('/:id', [
    authorize(['admin', 'mudur'])
], SiparisDurumGecmisiController.getSiparisDurumGecmisiDetay);

// Sipariş durum geçmişi oluştur
router.post('/', [
    authorize(['admin']),
    validateRequest(Joi.object({
        siparis_id: Joi.number().integer().required()
            .messages({
                'number.base': 'Sipariş ID sayı olmalıdır',
                'number.integer': 'Sipariş ID tam sayı olmalıdır',
                'any.required': 'Sipariş ID zorunludur'
            }),
        durum: Joi.string().required()
            .messages({
                'string.base': 'Durum metin olmalıdır',
                'any.required': 'Durum zorunludur'
            }),
        aciklama: Joi.string()
            .messages({
                'string.base': 'Açıklama metin olmalıdır'
            }),
        personel_id: Joi.number().integer()
            .messages({
                'number.base': 'Personel ID sayı olmalıdır',
                'number.integer': 'Personel ID tam sayı olmalıdır'
            })
    }))
], SiparisDurumGecmisiController.createSiparisDurumGecmisi);

// Sipariş durum geçmişi güncelle
router.put('/:id', [
    authorize(['admin']),
    validateRequest(Joi.object({
        siparis_id: Joi.number().integer()
            .messages({
                'number.base': 'Sipariş ID sayı olmalıdır',
                'number.integer': 'Sipariş ID tam sayı olmalıdır'
            }),
        durum: Joi.string()
            .messages({
                'string.base': 'Durum metin olmalıdır'
            }),
        aciklama: Joi.string()
            .messages({
                'string.base': 'Açıklama metin olmalıdır'
            }),
        personel_id: Joi.number().integer()
            .messages({
                'number.base': 'Personel ID sayı olmalıdır',
                'number.integer': 'Personel ID tam sayı olmalıdır'
            })
    }))
], SiparisDurumGecmisiController.updateSiparisDurumGecmisi);

// Sipariş durum geçmişi sil
router.delete('/:id', [
    authorize(['admin'])
], SiparisDurumGecmisiController.deleteSiparisDurumGecmisi);

// Sipariş durum geçmişi toplu oluştur
router.post('/toplu', [
    authorize(['admin']),
    validateRequest(Joi.object({
        kayitlar: Joi.array().items(
            Joi.object({
                siparis_id: Joi.number().integer().required()
                    .messages({
                        'number.base': 'Sipariş ID sayı olmalıdır',
                        'number.integer': 'Sipariş ID tam sayı olmalıdır',
                        'any.required': 'Sipariş ID zorunludur'
                    }),
                durum: Joi.string().required()
                    .messages({
                        'string.base': 'Durum metin olmalıdır',
                        'any.required': 'Durum zorunludur'
                    }),
                aciklama: Joi.string()
                    .messages({
                        'string.base': 'Açıklama metin olmalıdır'
                    }),
                personel_id: Joi.number().integer()
                    .messages({
                        'number.base': 'Personel ID sayı olmalıdır',
                        'number.integer': 'Personel ID tam sayı olmalıdır'
                    })
            })
        ).min(1).required()
            .messages({
                'array.base': 'Kayıtlar dizi olmalıdır',
                'array.min': 'En az bir kayıt eklenmelidir',
                'any.required': 'Kayıtlar zorunludur'
            })
    }))
], SiparisDurumGecmisiController.createTopluSiparisDurumGecmisi);

module.exports = router;