const Joi = require('joi');

const odemeSchema = Joi.object({
    adisyon_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Adisyon ID sayı olmalıdır',
            'number.integer': 'Adisyon ID tam sayı olmalıdır',
            'any.required': 'Adisyon ID zorunludur'
        }),

    tutar: Joi.number().positive().required()
        .messages({
            'number.base': 'tutar sayı olmalıdır',
            'number.positive': 'tutar pozitif olmalıdır',
            'any.required': 'tutar zorunludur'
        }),

    odeme_tipi: Joi.string().valid(
        'nakit',
        'kredi_karti',
        'havale',
        'sodexo',
        'multinet',
        'setcard',
        'ticket',
        'diger'
    ).required()
        .messages({
            'string.base': 'Ödeme tipi metin olmalıdır',
            'any.only': 'Geçerli bir ödeme tipi seçiniz',
            'any.required': 'Ödeme tipi zorunludur'
        }),

    aktif: Joi.string().valid('beklemede', 'tamamlandi', 'iptal_edildi').default('beklemede')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'aktif beklemede, tamamlandi veya iptal_edildi olmalıdır'
        }),

    islem_tarihi: Joi.date().default(Date.now)
        .messages({
            'date.base': 'İşlem tarihi geçerli bir tarih olmalıdır'
        }),

    personel_id: Joi.number().integer().required()
        .messages({
            'number.base': 'personel ID sayı olmalıdır',
            'number.integer': 'personel ID tam sayı olmalıdır',
            'any.required': 'personel ID zorunludur'
        }),

    kasa_id: Joi.number().integer().required()
        .messages({
            'number.base': 'Kasa ID sayı olmalıdır',
            'number.integer': 'Kasa ID tam sayı olmalıdır',
            'any.required': 'Kasa ID zorunludur'
        }),

    referans_no: Joi.string()
        .messages({
            'string.base': 'Referans no metin olmalıdır'
        }),

    taksit_sayisi: Joi.number().integer().min(1).when('odeme_tipi', {
        is: 'kredi_karti',
        then: Joi.required()
    })
        .messages({
            'number.base': 'Taksit sayısı sayı olmalıdır',
            'number.integer': 'Taksit sayısı tam sayı olmalıdır',
            'number.min': 'Taksit sayısı en az 1 olmalıdır',
            'any.required': 'Kredi kartı ödemelerinde taksit sayısı zorunludur'
        }),

    notlar: Joi.string()
        .messages({
            'string.base': 'Notlar metin olmalıdır'
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
const odemeUpdateSchema = odemeSchema.fork(
    ['adisyon_id', 'tutar', 'odeme_tipi', 'personel_id', 'kasa_id'],
    (schema) => schema.optional()
);

module.exports = {
    odemeSchema,
    odemeUpdateSchema
}; 