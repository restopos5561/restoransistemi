const Joi = require('joi');

const adisyonKalemiSchema = Joi.object({
    adisyon_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Adisyon ID sayı olmalıdır',
            'number.integer': 'Adisyon ID tam sayı olmalıdır',
            'number.positive': 'Adisyon ID pozitif olmalıdır',
            'any.required': 'Adisyon ID zorunludur'
        }),
    
    urun_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Ürün ID sayı olmalıdır',
            'number.integer': 'Ürün ID tam sayı olmalıdır',
            'number.positive': 'Ürün ID pozitif olmalıdır',
            'any.required': 'Ürün ID zorunludur'
        }),
    
    miktar: Joi.number().positive().required()
        .messages({
            'number.base': 'Miktar sayı olmalıdır',
            'number.positive': 'Miktar pozitif olmalıdır',
            'any.required': 'Miktar zorunludur'
        }),
    
    birim_fiyat: Joi.number().min(0)
        .messages({
            'number.base': 'Birim fiyat sayı olmalıdır',
            'number.min': 'Birim fiyat negatif olamaz'
        }),
    
    ikram_miktar: Joi.number().min(0)
        .messages({
            'number.base': 'İkram miktarı sayı olmalıdır',
            'number.min': 'İkram miktarı negatif olamaz'
        }),
    
    indirim_oran: Joi.number().min(0).max(100)
        .messages({
            'number.base': 'İndirim oranı sayı olmalıdır',
            'number.min': 'İndirim oranı negatif olamaz',
            'number.max': 'İndirim oranı 100\'den büyük olamaz'
        }),
    
    notlar: Joi.string().max(500)
        .messages({
            'string.base': 'Notlar metin olmalıdır',
            'string.max': 'Notlar en fazla 500 karakter olabilir'
        })
});

module.exports = {
    adisyonKalemiSchema
}; 