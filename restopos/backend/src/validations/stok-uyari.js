const Joi = require('joi');

const stokUyariSchema = Joi.object({
    stok_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'stok ID sayı olmalıdır',
            'number.integer': 'stok ID tam sayı olmalıdır',
            'number.positive': 'stok ID pozitif olmalıdır',
            'any.required': 'stok ID zorunludur'
        }),
    
    aktif: Joi.string().valid('Kritik', 'Uyari', 'Bilgi').required()
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif Kritik, Uyari veya Bilgi olmalıdır',
            'any.required': 'aktif zorunludur'
        }),
    
    mesaj: Joi.string().max(500).required()
        .messages({
            'string.base': 'Mesaj metin olmalıdır',
            'string.max': 'Mesaj en fazla 500 karakter olabilir',
            'any.required': 'Mesaj zorunludur'
        }),
    
    kritik_seviye: Joi.number().min(0)
        .messages({
            'number.base': 'Kritik seviye sayı olmalıdır',
            'number.min': 'Kritik seviye negatif olamaz'
        }),
    
    okundu: Joi.boolean()
        .messages({
            'boolean.base': 'Okundu değeri boolean olmalıdır'
        })
});

module.exports = {
    stokUyariSchema
}; 