const Joi = require('joi');

// Ana sipariş şeması
const mutfakSiparisSchema = Joi.object({
    masa_id: Joi.number().integer().required()
        .messages({
            'number.base': 'masa ID sayı olmalıdır',
            'number.integer': 'masa ID tam sayı olmalıdır',
            'any.required': 'masa ID zorunludur'
        }),
    
    urun_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Ürün ID sayı olmalıdır',
            'number.integer': 'Ürün ID tam sayı olmalıdır',
            'any.required': 'Ürün ID zorunludur'
        }),
    
    miktar: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'Miktar sayı olmalıdır',
            'number.integer': 'Miktar tam sayı olmalıdır',
            'number.min': 'Miktar en az 1 olmalıdır',
            'any.required': 'Miktar zorunludur'
        }),
    
    notlar: Joi.string().allow('', null)
        .messages({
            'string.base': 'Notlar metin olmalıdır'
        }),
    
    oncelik: Joi.number().integer().min(1).max(5).default(3)
        .messages({
            'number.base': 'Öncelik sayı olmalıdır',
            'number.integer': 'Öncelik tam sayı olmalıdır',
            'number.min': 'Öncelik en az 1 olmalıdır',
            'number.max': 'Öncelik en fazla 5 olmalıdır'
        }),
    
    aktif: Joi.string().valid('beklemede', 'hazirlaniyor', 'tamamlandi', 'iptal').default('beklemede')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif beklemede, hazirlaniyor, tamamlandi veya iptal olmalıdır'
        })
});

// aktif güncelleme şeması
const mutfakDurumSchema = Joi.object({
    aktif: Joi.string().valid('beklemede', 'hazirlaniyor', 'tamamlandi', 'iptal').required()
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif beklemede, hazirlaniyor, tamamlandi veya iptal olmalıdır',
            'any.required': 'aktif zorunludur'
        })
});

// Not güncelleme şeması
const mutfakNotSchema = Joi.object({
    notlar: Joi.string().required()
        .messages({
            'string.base': 'Not metin olmalıdır',
            'any.required': 'Not zorunludur'
        })
});

// Öncelik güncelleme şeması
const mutfakOncelikSchema = Joi.object({
    oncelik: Joi.number().integer().min(1).max(5).required()
        .messages({
            'number.base': 'Öncelik sayı olmalıdır',
            'number.integer': 'Öncelik tam sayı olmalıdır',
            'number.min': 'Öncelik en az 1 olmalıdır',
            'number.max': 'Öncelik en fazla 5 olmalıdır',
            'any.required': 'Öncelik zorunludur'
        })
});

// Tarih aralığı şeması
const mutfakTarihSchema = Joi.object({
    baslangic_tarihi: Joi.date().iso().required()
        .messages({
            'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
            'any.required': 'Başlangıç tarihi zorunludur'
        }),
    
    bitis_tarihi: Joi.date().iso().min(Joi.ref('baslangic_tarihi')).required()
        .messages({
            'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
            'date.min': 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
            'any.required': 'Bitiş tarihi zorunludur'
        })
});

module.exports = {
    mutfakSiparisSchema,
    mutfakDurumSchema,
    mutfakNotSchema,
    mutfakOncelikSchema,
    mutfakTarihSchema
}; 