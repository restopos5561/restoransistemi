const Joi = require('joi');

const urunSchema = Joi.object({
    ad: Joi.string().required()
        .messages({
            'string.base': 'Ürün adı metin olmalıdır',
            'any.required': 'Ürün adı zorunludur'
        }),

    kategori_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Kategori ID sayı olmalıdır',
            'number.integer': 'Kategori ID tam sayı olmalıdır',
            'any.required': 'Kategori ID zorunludur'
        }),

    fiyat: Joi.number().positive().required()
        .messages({
            'number.base': 'Fiyat sayı olmalıdır',
            'number.positive': 'Fiyat pozitif olmalıdır',
            'any.required': 'Fiyat zorunludur'
        }),

    birim: Joi.string().valid('adet', 'kg', 'gr', 'lt', 'ml', 'porsiyon').required()
        .messages({
            'string.base': 'Birim metin olmalıdır',
            'any.only': 'Geçerli bir birim seçiniz',
            'any.required': 'Birim zorunludur'
        }),

    stok_takibi: Joi.boolean().default(false)
        .messages({
            'boolean.base': 'stok takibi boolean olmalıdır'
        }),

    stok_miktari: Joi.number().min(0).when('stok_takibi', {
        is: true,
        then: Joi.required()
    })
        .messages({
            'number.base': 'stok miktarı sayı olmalıdır',
            'number.min': 'stok miktarı 0 veya daha büyük olmalıdır',
            'any.required': 'stok takibi aktif ise stok miktarı zorunludur'
        }),

    kritik_stok: Joi.number().min(0).when('stok_takibi', {
        is: true,
        then: Joi.required()
    })
        .messages({
            'number.base': 'Kritik stok sayı olmalıdır',
            'number.min': 'Kritik stok 0 veya daha büyük olmalıdır',
            'any.required': 'stok takibi aktif ise kritik stok zorunludur'
        }),

    barkod: Joi.string()
        .messages({
            'string.base': 'Barkod metin olmalıdır'
        }),

    resim_url: Joi.string().uri()
        .messages({
            'string.base': 'resim URL metin olmalıdır',
            'string.uri': 'Geçerli bir URL girilmelidir'
        }),

    aciklama: Joi.string()
        .messages({
            'string.base': 'Açıklama metin olmalıdır'
        }),

    kalori: Joi.number().min(0)
        .messages({
            'number.base': 'Kalori sayı olmalıdır',
            'number.min': 'Kalori 0 veya daha büyük olmalıdır'
        }),

    hazirlanma_suresi: Joi.number().integer().min(0)
        .messages({
            'number.base': 'Hazırlanma süresi sayı olmalıdır',
            'number.integer': 'Hazırlanma süresi tam sayı olmalıdır',
            'number.min': 'Hazırlanma süresi 0 veya daha büyük olmalıdır'
        }),

    aktif: Joi.string().valid('aktif', 'pasif', 'tukendi').default('aktif')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif aktif, pasif veya tukendi olmalıdır'
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
const urunUpdateSchema = urunSchema.fork(
    ['ad', 'kategori_id', 'fiyat', 'birim'],
    (schema) => schema.optional()
);

module.exports = {
    urunSchema,
    urunUpdateSchema
}; 