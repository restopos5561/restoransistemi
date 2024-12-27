const Joi = require('joi');

const siparisDetaySchema = Joi.object({
    siparis_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Sipariş ID sayı olmalıdır',
            'number.integer': 'Sipariş ID tam sayı olmalıdır',
            'number.positive': 'Sipariş ID pozitif olmalıdır',
            'any.required': 'Sipariş ID zorunludur'
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
    
    notlar: Joi.string().max(500)
        .messages({
            'string.base': 'Notlar metin olmalıdır',
            'string.max': 'Notlar en fazla 500 karakter olabilir'
        })
});

module.exports = {
    siparisDetaySchema
}; 