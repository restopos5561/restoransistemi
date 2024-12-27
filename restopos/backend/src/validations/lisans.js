const Joi = require('joi');

const lisansSchema = Joi.object({
    lisans_kodu: Joi.string().required()
        .messages({
            'string.base': 'Lisans kodu metin olmalıdır',
            'any.required': 'Lisans kodu zorunludur'
        }),

    baslangic_tarihi: Joi.date().required()
        .messages({
            'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
            'any.required': 'Başlangıç tarihi zorunludur'
        }),

    bitis_tarihi: Joi.date().required()
        .messages({
            'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
            'any.required': 'Bitiş tarihi zorunludur'
        }),

    aktif: Joi.string().valid('aktif', 'pasif', 'suresi_dolmus').required()
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif aktif, pasif veya suresi_dolmus olmalıdır',
            'any.required': 'aktif zorunludur'
        }),

    ozellikler: Joi.object({
        max_kullanici: Joi.number().integer().min(1),
        max_masa: Joi.number().integer().min(1),
        max_urun: Joi.number().integer().min(1),
        modul_listesi: Joi.array().items(Joi.string()),
        bulut_yedekleme: Joi.boolean(),
        teknik_destek: Joi.boolean(),
        uzak_erisim: Joi.boolean()
    }).required()
        .messages({
            'object.base': 'Özellikler obje olmalıdır',
            'any.required': 'Özellikler zorunludur'
        }),

    musteri_bilgileri: Joi.object({
        ad: Joi.string().required(),
        soyad: Joi.string().required(),
        firma_adi: Joi.string(),
        vergi_no: Joi.string(),
        email: Joi.string().email().required(),
        telefon: Joi.string().pattern(/^[0-9]{10}$/).required()
    }).required()
        .messages({
            'object.base': 'Müşteri bilgileri obje olmalıdır',
            'any.required': 'Müşteri bilgileri zorunludur'
        }),

    notlar: Joi.string()
        .messages({
            'string.base': 'Notlar metin olmalıdır'
        })
});

// Güncelleme için kullanılacak şema
const lisansUpdateSchema = lisansSchema.fork(
    ['lisans_kodu', 'baslangic_tarihi', 'bitis_tarihi', 'musteri_bilgileri'],
    (schema) => schema.optional()
);

module.exports = {
    lisansSchema,
    lisansUpdateSchema
}; 