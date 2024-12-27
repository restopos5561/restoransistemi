const Joi = require('joi');

const kasaSchema = Joi.object({
    ad: Joi.string().required()
        .messages({
            'string.base': 'Ad metin olmalıdır',
            'any.required': 'Ad zorunludur'
        }),

    aciklama: Joi.string()
        .messages({
            'string.base': 'Açıklama metin olmalıdır'
        }),

    baslangic_bakiye: Joi.number().default(0)
        .messages({
            'number.base': 'Başlangıç bakiye sayı olmalıdır'
        }),

    guncel_bakiye: Joi.number().default(0)
        .messages({
            'number.base': 'Güncel bakiye sayı olmalıdır'
        }),

    aktif: Joi.string().valid('aktif', 'pasif').default('aktif')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif aktif veya pasif olmalıdır'
        }),

    son_islem_tarihi: Joi.date()
        .messages({
            'date.base': 'Son işlem tarihi geçerli bir tarih olmalıdır'
        }),

    sorumlu_personel_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Sorumlu personel ID sayı olmalıdır',
            'number.integer': 'Sorumlu personel ID tam sayı olmalıdır',
            'any.required': 'Sorumlu personel ID zorunludur'
        }),

    lokasyon: Joi.string()
        .messages({
            'string.base': 'Lokasyon metin olmalıdır'
        }),

    pos_cihazi: Joi.string()
        .messages({
            'string.base': 'pos cihazı metin olmalıdır'
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
const kasaUpdateSchema = kasaSchema.fork(
    ['ad', 'sorumlu_personel_id'],
    (schema) => schema.optional()
);

module.exports = {
    kasaSchema,
    kasaUpdateSchema
}; 