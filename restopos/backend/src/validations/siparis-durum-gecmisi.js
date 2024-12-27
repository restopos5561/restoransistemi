const Joi = require('joi');

const siparisDurumGecmisiSchema = Joi.object({
    siparis_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Sipariş ID sayı olmalıdır',
            'number.integer': 'Sipariş ID tam sayı olmalıdır',
            'any.required': 'Sipariş ID zorunludur'
        }),
    eski_durum: Joi.string().required()
        .messages({
            'string.base': 'Eski aktif metin olmalıdır',
            'any.required': 'Eski aktif zorunludur'
        }),
    yeni_durum: Joi.string().required()
        .messages({
            'string.base': 'Yeni aktif metin olmalıdır',
            'any.required': 'Yeni aktif zorunludur'
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
    ip_adresi: Joi.string()
        .messages({
            'string.base': 'IP adresi metin olmalıdır'
        }),
    tarayici_bilgisi: Joi.string()
        .messages({
            'string.base': 'Tarayıcı bilgisi metin olmalıdır'
        })
});

module.exports = {
    siparisDurumGecmisiSchema
}; 