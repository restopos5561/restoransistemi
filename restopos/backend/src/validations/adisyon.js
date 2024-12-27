const Joi = require('joi');

const adisyonSchema = Joi.object({
    masa_id: Joi.number().integer()
        .messages({
            'number.base': 'masa ID sayı olmalıdır',
            'number.integer': 'masa ID tam sayı olmalıdır'
        }),

    musteri_id: Joi.number().integer()
        .messages({
            'number.base': 'Müşteri ID sayı olmalıdır',
            'number.integer': 'Müşteri ID tam sayı olmalıdır'
        }),

    personel_id: Joi.number().integer().required()
        .messages({
            'number.base': 'personel ID sayı olmalıdır',
            'number.integer': 'personel ID tam sayı olmalıdır',
            'any.required': 'personel ID zorunludur'
        }),

    aktif: Joi.string().valid('aktif', 'odendi', 'iptal').default('aktif')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif aktif, odendi veya iptal olmalıdır'
        }),

    toplam_tutar: Joi.number().min(0).default(0)
        .messages({
            'number.base': 'Toplam tutar sayı olmalıdır',
            'number.min': 'Toplam tutar 0 veya daha büyük olmalıdır'
        }),

    indirim_tutari: Joi.number().min(0).default(0)
        .messages({
            'number.base': 'İndirim tutarı sayı olmalıdır',
            'number.min': 'İndirim tutarı 0 veya daha büyük olmalıdır'
        }),

    indirim_orani: Joi.number().min(0).max(100).default(0)
        .messages({
            'number.base': 'İndirim oranı sayı olmalıdır',
            'number.min': 'İndirim oranı 0 veya daha büyük olmalıdır',
            'number.max': 'İndirim oranı 100 veya daha küçük olmalıdır'
        }),

    odeme_durumu: Joi.string().valid('beklemede', 'kismi_odeme', 'odendi').default('beklemede')
        .messages({
            'string.base': 'Ödeme durumu metin olmalıdır',
            'any.only': 'Ödeme durumu beklemede, kismi_odeme veya odendi olmalıdır'
        }),

    notlar: Joi.string()
        .messages({
            'string.base': 'Notlar metin olmalıdır'
        }),

    paket_siparis: Joi.boolean().default(false)
        .messages({
            'boolean.base': 'paket sipariş boolean olmalıdır'
        }),

    adres: Joi.string().when('paket_siparis', {
        is: true,
        then: Joi.required()
    })
        .messages({
            'string.base': 'Adres metin olmalıdır',
            'any.required': 'paket sipariş için adres zorunludur'
        }),

    telefon: Joi.string().pattern(/^[0-9]{10}$/).when('paket_siparis', {
        is: true,
        then: Joi.required()
    })
        .messages({
            'string.base': 'Telefon metin olmalıdır',
            'string.pattern.base': 'Telefon 10 haneli olmalıdır',
            'any.required': 'paket sipariş için telefon zorunludur'
        }),

    tahmini_teslimat: Joi.date().when('paket_siparis', {
        is: true,
        then: Joi.required()
    })
        .messages({
            'date.base': 'Tahmini teslimat geçerli bir tarih olmalıdır',
            'any.required': 'paket sipariş için tahmini teslimat zorunludur'
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
const adisyonUpdateSchema = adisyonSchema.fork(
    ['masa_id', 'musteri_id', 'personel_id'],
    (schema) => schema.optional()
);

module.exports = {
    adisyonSchema,
    adisyonUpdateSchema
}; 