const Joi = require('joi');

// Ana sipariş şeması
const createSiparisSchema = Joi.object({
    adisyon_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Adisyon ID sayı olmalıdır',
            'number.integer': 'Adisyon ID tam sayı olmalıdır',
            'any.required': 'Adisyon ID zorunludur'
        }),

    masa_id: Joi.number().integer()
        .messages({
            'number.base': 'masa ID sayı olmalıdır',
            'number.integer': 'masa ID tam sayı olmalıdır'
        }),

    personel_id: Joi.number().integer().required()
        .messages({
            'number.base': 'personel ID sayı olmalıdır',
            'number.integer': 'personel ID tam sayı olmalıdır',
            'any.required': 'personel ID zorunludur'
        }),

    aktif: Joi.string().valid(
        'beklemede',
        'hazirlaniyor',
        'tamamlandi',
        'iptal_edildi'
    ).default('beklemede')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'Geçerli bir aktif seçiniz'
        }),

    oncelik: Joi.string().valid('normal', 'yuksek', 'acil').default('normal')
        .messages({
            'string.base': 'Öncelik metin olmalıdır',
            'any.only': 'Öncelik normal, yuksek veya acil olmalıdır'
        }),

    notlar: Joi.string()
        .messages({
            'string.base': 'Notlar metin olmalıdır'
        }),

    mutfak_notu: Joi.string()
        .messages({
            'string.base': 'mutfak notu metin olmalıdır'
        }),

    paket_siparis: Joi.boolean().default(false)
        .messages({
            'boolean.base': 'paket sipariş boolean olmalıdır'
        }),

    tahmini_sure: Joi.number().integer().min(0)
        .messages({
            'number.base': 'Tahmini süre sayı olmalıdır',
            'number.integer': 'Tahmini süre tam sayı olmalıdır',
            'number.min': 'Tahmini süre 0 veya daha büyük olmalıdır'
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

// Güncelleme şeması
const updateSiparisSchema = createSiparisSchema.fork(
    ['adisyon_id', 'masa_id', 'personel_id'],
    (schema) => schema.optional()
);

// aktif güncelleme şeması
const updateDurumSchema = Joi.object({
    aktif: Joi.string().valid(
        'beklemede',
        'hazirlaniyor',
        'tamamlandi',
        'iptal_edildi'
    ).required()
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'Geçerli bir aktif seçiniz',
            'any.required': 'aktif zorunludur'
        })
});

// Ürün ekleme şeması
const urunEkleSchema = Joi.object({
    urun_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Ürün ID sayı olmalıdır',
            'number.integer': 'Ürün ID tam sayı olmalıdır',
            'any.required': 'Ürün ID zorunludur'
        }),
    miktar: Joi.number().min(1).required()
        .messages({
            'number.base': 'Miktar sayı olmalıdır',
            'number.min': 'Miktar en az 1 olmalıdır',
            'any.required': 'Miktar zorunludur'
        }),
    notlar: Joi.string()
        .messages({
            'string.base': 'Notlar metin olmalıdır'
        })
});

// Detay güncelleme şeması
const updateDetaySchema = Joi.object({
    miktar: Joi.number().min(1)
        .messages({
            'number.base': 'Miktar sayı olmalıdır',
            'number.min': 'Miktar en az 1 olmalıdır'
        }),
    notlar: Joi.string()
        .messages({
            'string.base': 'Notlar metin olmalıdır'
        })
});

// Notlar güncelleme şeması
const updateNotlarSchema = Joi.object({
    notlar: Joi.string().required()
        .messages({
            'string.base': 'Notlar metin olmalıdır',
            'any.required': 'Notlar zorunludur'
        })
});

module.exports = {
    createSiparisSchema,
    updateSiparisSchema,
    updateDurumSchema,
    urunEkleSchema,
    updateDetaySchema,
    updateNotlarSchema
}; 