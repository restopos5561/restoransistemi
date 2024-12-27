const Joi = require('joi');

// stok hareketi oluşturma şeması
const createStokHareketSchema = Joi.object({
    stok_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'stok ID sayı olmalıdır',
            'number.integer': 'stok ID tam sayı olmalıdır',
            'number.positive': 'stok ID pozitif olmalıdır',
            'any.required': 'stok ID zorunludur'
        }),
    
    hareket_tipi: Joi.string().valid('giris', 'cikis', 'sayim', 'transfer').required()
        .messages({
            'string.base': 'Hareket tipi metin olmalıdır',
            'any.only': 'Hareket tipi giris, cikis, sayim veya transfer olmalıdır',
            'any.required': 'Hareket tipi zorunludur'
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
    
    aciklama: Joi.string().max(500)
        .messages({
            'string.base': 'Açıklama metin olmalıdır',
            'string.max': 'Açıklama en fazla 500 karakter olabilir'
        }),
    
    referans_no: Joi.string().max(50)
        .messages({
            'string.base': 'Referans no metin olmalıdır',
            'string.max': 'Referans no en fazla 50 karakter olabilir'
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

// stok hareketi güncelleme şeması
const updateStokHareketSchema = createStokHareketSchema.fork(
    ['stok_id', 'hareket_tipi', 'miktar'],
    (schema) => schema.optional()
);

// stok hareketi tarih aralığı şeması
const stokHareketTarihSchema = Joi.object({
    baslangic: Joi.date().required()
        .messages({
            'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
            'any.required': 'Başlangıç tarihi zorunludur'
        }),
    
    bitis: Joi.date().min(Joi.ref('baslangic')).required()
        .messages({
            'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
            'date.min': 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
            'any.required': 'Bitiş tarihi zorunludur'
        })
});

module.exports = {
    createStokHareketSchema,
    updateStokHareketSchema,
    stokHareketTarihSchema
}; 