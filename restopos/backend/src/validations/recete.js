const Joi = require('joi');

const receteSchema = Joi.object({
    urun_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Ürün ID sayı olmalıdır',
            'number.integer': 'Ürün ID tam sayı olmalıdır',
            'any.required': 'Ürün ID zorunludur'
        }),
    malzemeler: Joi.array().items(
        Joi.object({
            stok_id: Joi.number().integer().required()
                .messages({
                    'number.base': 'Stok ID sayı olmalıdır',
                    'number.integer': 'Stok ID tam sayı olmalıdır',
                    'any.required': 'Stok ID zorunludur'
                }),
            miktar: Joi.number().positive().required()
                .messages({
                    'number.base': 'Miktar sayı olmalıdır',
                    'number.positive': 'Miktar pozitif olmalıdır',
                    'any.required': 'Miktar zorunludur'
                }),
            birim: Joi.string().required()
                .messages({
                    'string.base': 'Birim metin olmalıdır',
                    'any.required': 'Birim zorunludur'
                })
        })
    ).min(1).required()
        .messages({
            'array.base': 'Malzemeler dizi olmalıdır',
            'array.min': 'En az bir malzeme eklenmelidir',
            'any.required': 'Malzemeler zorunludur'
        }),
    hazirlama_suresi: Joi.number().integer().min(0)
        .messages({
            'number.base': 'Hazırlama süresi sayı olmalıdır',
            'number.integer': 'Hazırlama süresi tam sayı olmalıdır',
            'number.min': 'Hazırlama süresi 0 veya daha büyük olmalıdır'
        }),
    pisirme_suresi: Joi.number().integer().min(0)
        .messages({
            'number.base': 'Pişirme süresi sayı olmalıdır',
            'number.integer': 'Pişirme süresi tam sayı olmalıdır',
            'number.min': 'Pişirme süresi 0 veya daha büyük olmalıdır'
        }),
    hazirlama_notu: Joi.string()
        .messages({
            'string.base': 'Hazırlama notu metin olmalıdır'
        }),
    kalori: Joi.number().min(0)
        .messages({
            'number.base': 'Kalori sayı olmalıdır',
            'number.min': 'Kalori 0 veya daha büyük olmalıdır'
        }),
    porsiyon: Joi.number().positive()
        .messages({
            'number.base': 'Porsiyon sayı olmalıdır',
            'number.positive': 'Porsiyon pozitif olmalıdır'
        }),
    durum: Joi.boolean()
        .messages({
            'boolean.base': 'Durum boolean olmalıdır'
        })
});

module.exports = {
    receteSchema
}; 