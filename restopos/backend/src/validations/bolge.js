const Joi = require('joi');

const bolgeSchema = Joi.object({
    ad: Joi.string().required()
        .messages({
            'string.base': 'Ad metin olmalıdır',
            'any.required': 'Ad zorunludur'
        }),

    aciklama: Joi.string()
        .messages({
            'string.base': 'Açıklama metin olmalıdır'
        }),

    kapasite: Joi.number().integer().min(0)
        .messages({
            'number.base': 'Kapasite sayı olmalıdır',
            'number.integer': 'Kapasite tam sayı olmalıdır',
            'number.min': 'Kapasite 0 veya daha büyük olmalıdır'
        }),

    siralama: Joi.number().integer().min(0)
        .messages({
            'number.base': 'Sıralama sayı olmalıdır',
            'number.integer': 'Sıralama tam sayı olmalıdır',
            'number.min': 'Sıralama 0 veya daha büyük olmalıdır'
        }),

    aktif: Joi.string().valid('aktif', 'pasif').default('aktif')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif aktif veya pasif olmalıdır'
        }),

    ozellikler: Joi.object({
        sigara_icilen: Joi.boolean(),
        bahce: Joi.boolean(),
        klima: Joi.boolean(),
        manzara: Joi.boolean(),
        vip: Joi.boolean()
    }).messages({
        'object.base': 'Özellikler obje olmalıdır'
    }),

    garson_id: Joi.number().integer()
        .messages({
            'number.base': 'Garson ID sayı olmalıdır',
            'number.integer': 'Garson ID tam sayı olmalıdır'
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
const bolgeUpdateSchema = bolgeSchema.fork(
    ['ad'],
    (schema) => schema.optional()
);

module.exports = {
    bolgeSchema,
    bolgeUpdateSchema
}; 