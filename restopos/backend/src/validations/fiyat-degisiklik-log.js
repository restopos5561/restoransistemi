const Joi = require('joi');

const fiyatDegisiklikLogSchema = Joi.object({
    urun_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Ürün ID sayı olmalıdır',
            'number.integer': 'Ürün ID tam sayı olmalıdır',
            'any.required': 'Ürün ID zorunludur'
        }),

    eski_fiyat: Joi.number().required()
        .messages({
            'number.base': 'Eski fiyat sayı olmalıdır',
            'any.required': 'Eski fiyat zorunludur'
        }),

    yeni_fiyat: Joi.number().required()
        .messages({
            'number.base': 'Yeni fiyat sayı olmalıdır',
            'any.required': 'Yeni fiyat zorunludur'
        }),

    degisiklik_tarihi: Joi.date().default(Date.now)
        .messages({
            'date.base': 'Değişiklik tarihi geçerli bir tarih olmalıdır'
        }),

    degistiren_kullanici_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Değiştiren kullanıcı ID sayı olmalıdır',
            'number.integer': 'Değiştiren kullanıcı ID tam sayı olmalıdır',
            'any.required': 'Değiştiren kullanıcı ID zorunludur'
        }),

    aciklama: Joi.string()
        .messages({
            'string.base': 'Açıklama metin olmalıdır'
        }),

    degisiklik_nedeni: Joi.string().valid(
        'maliyet_artisi',
        'rekabet',
        'promosyon',
        'sezonsal_degisiklik',
        'diger'
    ).required()
        .messages({
            'string.base': 'Değişiklik nedeni metin olmalıdır',
            'any.only': 'Geçerli bir değişiklik nedeni seçiniz',
            'any.required': 'Değişiklik nedeni zorunludur'
        })
});

module.exports = {
    fiyatDegisiklikLogSchema
}; 