const Joi = require('joi');

const rezervasyonSchema = Joi.object({
    masa_id: Joi.number().integer().required()
        .messages({
            'number.base': 'masa ID sayı olmalıdır',
            'number.integer': 'masa ID tam sayı olmalıdır',
            'any.required': 'masa ID zorunludur'
        }),

    musteri_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Müşteri ID sayı olmalıdır',
            'number.integer': 'Müşteri ID tam sayı olmalıdır',
            'any.required': 'Müşteri ID zorunludur'
        }),

    personel_id: Joi.number().integer().required()
        .messages({
            'number.base': 'personel ID sayı olmalıdır',
            'number.integer': 'personel ID tam sayı olmalıdır',
            'any.required': 'personel ID zorunludur'
        }),

    rezervasyon_tarihi: Joi.date().required()
        .messages({
            'date.base': 'rezervasyon tarihi geçerli bir tarih olmalıdır',
            'any.required': 'rezervasyon tarihi zorunludur'
        }),

    kisi_sayisi: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'Kişi sayısı sayı olmalıdır',
            'number.integer': 'Kişi sayısı tam sayı olmalıdır',
            'number.min': 'Kişi sayısı en az 1 olmalıdır',
            'any.required': 'Kişi sayısı zorunludur'
        }),

    aktif: Joi.string().valid('beklemede', 'onaylandi', 'iptal_edildi').default('beklemede')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif beklemede, onaylandi veya iptal_edildi olmalıdır'
        }),

    ozel_istekler: Joi.string()
        .messages({
            'string.base': 'Özel istekler metin olmalıdır'
        }),

    notlar: Joi.string()
        .messages({
            'string.base': 'Notlar metin olmalıdır'
        }),

    onay_tarihi: Joi.date()
        .messages({
            'date.base': 'Onay tarihi geçerli bir tarih olmalıdır'
        }),

    iptal_tarihi: Joi.date()
        .messages({
            'date.base': 'İptal tarihi geçerli bir tarih olmalıdır'
        }),

    iptal_nedeni: Joi.string().when('aktif', {
        is: 'iptal_edildi',
        then: Joi.required()
    })
        .messages({
            'string.base': 'İptal nedeni metin olmalıdır',
            'any.required': 'İptal edildiğinde iptal nedeni zorunludur'
        }),

    hatirlatma_gonderildi: Joi.boolean().default(false)
        .messages({
            'boolean.base': 'Hatırlatma gönderildi boolean olmalıdır'
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
const rezervasyonUpdateSchema = rezervasyonSchema.fork(
    ['masa_id', 'musteri_id', 'personel_id', 'rezervasyon_tarihi', 'kisi_sayisi'],
    (schema) => schema.optional()
);

module.exports = {
    rezervasyonSchema,
    rezervasyonUpdateSchema
}; 