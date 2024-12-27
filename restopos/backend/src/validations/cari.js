const Joi = require('joi');

const cariSchema = Joi.object({
    ad: Joi.string().required()
        .messages({
            'string.base': 'Ad metin olmalıdır',
            'any.required': 'Ad zorunludur'
        }),

    soyad: Joi.string().required()
        .messages({
            'string.base': 'Soyad metin olmalıdır',
            'any.required': 'Soyad zorunludur'
        }),

    telefon: Joi.string().pattern(/^[0-9]{10}$/).required()
        .messages({
            'string.base': 'Telefon metin olmalıdır',
            'string.pattern.base': 'Telefon 10 haneli olmalıdır',
            'any.required': 'Telefon zorunludur'
        }),

    email: Joi.string().email()
        .messages({
            'string.base': 'Email metin olmalıdır',
            'string.email': 'Geçerli bir email adresi giriniz'
        }),

    adres: Joi.string()
        .messages({
            'string.base': 'Adres metin olmalıdır'
        }),

    vergi_dairesi: Joi.string()
        .messages({
            'string.base': 'Vergi dairesi metin olmalıdır'
        }),

    vergi_no: Joi.string()
        .messages({
            'string.base': 'Vergi no metin olmalıdır'
        }),

    firma_adi: Joi.string()
        .messages({
            'string.base': 'Firma adı metin olmalıdır'
        }),

    borc_limiti: Joi.number().min(0)
        .messages({
            'number.base': 'Borç limiti sayı olmalıdır',
            'number.min': 'Borç limiti 0 veya daha büyük olmalıdır'
        }),

    bakiye: Joi.number().default(0)
        .messages({
            'number.base': 'Bakiye sayı olmalıdır'
        }),

    aktif: Joi.string().valid('aktif', 'pasif').default('aktif')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif aktif veya pasif olmalıdır'
        }),

    notlar: Joi.string()
        .messages({
            'string.base': 'Notlar metin olmalıdır'
        }),

    etiketler: Joi.array().items(Joi.string())
        .messages({
            'array.base': 'Etiketler dizi olmalıdır',
            'string.base': 'Etiketler metin olmalıdır'
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
const cariUpdateSchema = cariSchema.fork(
    ['ad', 'soyad', 'telefon'],
    (schema) => schema.optional()
);

module.exports = {
    cariSchema,
    cariUpdateSchema
}; 