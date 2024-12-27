const Joi = require('joi');

// stok oluşturma şeması
const createStokSchema = Joi.object({
    urun_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Ürün ID sayı olmalıdır',
            'number.integer': 'Ürün ID tam sayı olmalıdır',
            'any.required': 'Ürün ID zorunludur'
        }),

    miktar: Joi.number().min(0).required()
        .messages({
            'number.base': 'Miktar sayı olmalıdır',
            'number.min': 'Miktar 0 veya daha büyük olmalıdır',
            'any.required': 'Miktar zorunludur'
        }),

    birim: Joi.string().required()
        .messages({
            'string.base': 'Birim metin olmalıdır',
            'any.required': 'Birim zorunludur'
        }),

    kritik_stok_seviyesi: Joi.number().min(0)
        .messages({
            'number.base': 'Kritik stok seviyesi sayı olmalıdır',
            'number.min': 'Kritik stok seviyesi 0 veya daha büyük olmalıdır'
        }),

    depo_id: Joi.number().integer()
        .messages({
            'number.base': 'depo ID sayı olmalıdır',
            'number.integer': 'depo ID tam sayı olmalıdır'
        }),

    notlar: Joi.string()
        .messages({
            'string.base': 'Notlar metin olmalıdır'
        })
});

// stok güncelleme şeması
const updateStokSchema = createStokSchema.fork(
    ['urun_id', 'miktar', 'birim'],
    (schema) => schema.optional()
);

// stok hareket şeması
const stokHareketSchema = Joi.object({
    miktar: Joi.number().min(0.01).required()
        .messages({
            'number.base': 'Miktar sayı olmalıdır',
            'number.min': 'Miktar 0\'dan büyük olmalıdır',
            'any.required': 'Miktar zorunludur'
        }),

    aciklama: Joi.string()
        .messages({
            'string.base': 'Açıklama metin olmalıdır'
        }),

    referans_no: Joi.string()
        .messages({
            'string.base': 'Referans no metin olmalıdır'
        }),

    belge_no: Joi.string()
        .messages({
            'string.base': 'belge no metin olmalıdır'
        }),

    hareket_tipi: Joi.string().valid('giris', 'cikis', 'sayim', 'transfer').required()
        .messages({
            'string.base': 'Hareket tipi metin olmalıdır',
            'any.only': 'Geçerli bir hareket tipi seçiniz',
            'any.required': 'Hareket tipi zorunludur'
        }),

    hedef_depo_id: Joi.number().integer()
        .when('hareket_tipi', {
            is: 'transfer',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .messages({
            'number.base': 'Hedef depo ID sayı olmalıdır',
            'number.integer': 'Hedef depo ID tam sayı olmalıdır',
            'any.required': 'transfer işlemi için hedef depo ID zorunludur'
        })
});

module.exports = {
    createStokSchema,
    updateStokSchema,
    stokHareketSchema
}; 