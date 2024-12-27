const Joi = require('joi');

const masaSchema = Joi.object({
    numara: Joi.string().required()
        .messages({
            'string.base': 'masa numarası metin olmalıdır',
            'any.required': 'masa numarası zorunludur'
        }),
    
    bolge_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Bölge ID sayı olmalıdır',
            'number.integer': 'Bölge ID tam sayı olmalıdır',
            'any.required': 'Bölge ID zorunludur'
        }),
    
    kapasite: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'Kapasite sayı olmalıdır',
            'number.integer': 'Kapasite tam sayı olmalıdır',
            'number.min': 'Kapasite en az 1 olmalıdır',
            'any.required': 'Kapasite zorunludur'
        }),
    
    aktif: Joi.string().valid('bos', 'dolu', 'rezerve').default('bos')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif bos, dolu veya rezerve olmalıdır'
        }),
    
    aciklama: Joi.string()
        .messages({
            'string.base': 'Açıklama metin olmalıdır'
        }),
    
    aktif: Joi.boolean().default(true)
        .messages({
            'boolean.base': 'aktif boolean olmalıdır'
        }),
    
    siralama: Joi.number().integer().min(0)
        .messages({
            'number.base': 'Sıralama sayı olmalıdır',
            'number.integer': 'Sıralama tam sayı olmalıdır',
            'number.min': 'Sıralama 0 veya daha büyük olmalıdır'
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
    
    qr_kod: Joi.string()
        .messages({
            'string.base': 'QR kod metin olmalıdır'
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
const masaUpdateSchema = masaSchema.fork(
    ['numara', 'bolge_id', 'kapasite'],
    (schema) => schema.optional()
);

const masaAyirSchema = Joi.object({
    yeni_masa_no: Joi.string().required()
});

const masaRezervasyonSchema = Joi.object({
    baslangic_tarihi: Joi.date().iso().required(),
    bitis_tarihi: Joi.date().iso().greater(Joi.ref('baslangic_tarihi')).required(),
    musteri_adi: Joi.string().required(),
    kisi_sayisi: Joi.number().integer().min(1).required(),
    notlar: Joi.string().allow('', null)
});

module.exports = {
    masaSchema,
    masaUpdateSchema,
    masaAyirSchema,
    masaRezervasyonSchema
}; 