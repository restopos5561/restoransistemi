const Joi = require('joi');

const rolSchema = Joi.object({
    ad: Joi.string().required()
        .messages({
            'string.base': 'Ad metin olmalıdır',
            'any.required': 'Ad zorunludur'
        }),

    aciklama: Joi.string()
        .messages({
            'string.base': 'Açıklama metin olmalıdır'
        }),

    yetkiler: Joi.array().items(Joi.string()).required()
        .messages({
            'array.base': 'Yetkiler dizi olmalıdır',
            'string.base': 'Yetkiler metin olmalıdır',
            'any.required': 'Yetkiler zorunludur'
        }),

    aktif: Joi.string().valid('aktif', 'pasif').default('aktif')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif aktif veya pasif olmalıdır'
        }),

    varsayilan: Joi.boolean().default(false)
        .messages({
            'boolean.base': 'Varsayılan boolean olmalıdır'
        }),

    olusturma_tarihi: Joi.date().default(Date.now)
        .messages({
            'date.base': 'Oluşturma tarihi geçerli bir tarih olmalıdır'
        }),

    guncelleme_tarihi: Joi.date().default(Date.now)
        .messages({
            'date.base': 'Güncelleme tarihi geçerli bir tarih olmalıdır'
        })
});

// Güncelleme için kullanılacak şema
const rolUpdateSchema = rolSchema.fork(
    ['ad', 'yetkiler'],
    (schema) => schema.optional()
);

module.exports = {
    rolSchema,
    rolUpdateSchema
}; 