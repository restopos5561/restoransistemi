const Joi = require('joi');

const kasaHareketiSchema = Joi.object({
    islem_tipi: Joi.string().valid('giris', 'cikis').required()
        .messages({
            'string.base': 'İşlem tipi metin olmalıdır',
            'any.only': 'İşlem tipi giris veya cikis olmalıdır',
            'any.required': 'İşlem tipi zorunludur'
        }),

    tutar: Joi.number().positive().required()
        .messages({
            'number.base': 'tutar sayı olmalıdır',
            'number.positive': 'tutar pozitif olmalıdır',
            'any.required': 'tutar zorunludur'
        }),

    odeme_tipi: Joi.string().valid('nakit', 'kredi_karti', 'havale', 'diger').required()
        .messages({
            'string.base': 'Ödeme tipi metin olmalıdır',
            'any.only': 'Geçerli bir ödeme tipi seçiniz',
            'any.required': 'Ödeme tipi zorunludur'
        }),

    aciklama: Joi.string().required()
        .messages({
            'string.base': 'Açıklama metin olmalıdır',
            'any.required': 'Açıklama zorunludur'
        }),

    referans_no: Joi.string()
        .messages({
            'string.base': 'Referans no metin olmalıdır'
        }),

    belge_no: Joi.string()
        .messages({
            'string.base': 'belge no metin olmalıdır'
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

    adisyon_id: Joi.number().integer()
        .messages({
            'number.base': 'Adisyon ID sayı olmalıdır',
            'number.integer': 'Adisyon ID tam sayı olmalıdır'
        }),

    cari_id: Joi.number().integer()
        .messages({
            'number.base': 'Cari ID sayı olmalıdır',
            'number.integer': 'Cari ID tam sayı olmalıdır'
        }),

    kategori: Joi.string().valid(
        'satis',
        'iade',
        'gider',
        'maas',
        'vergi',
        'diger'
    ).required()
        .messages({
            'string.base': 'Kategori metin olmalıdır',
            'any.only': 'Geçerli bir kategori seçiniz',
            'any.required': 'Kategori zorunludur'
        }),

    aktif: Joi.string().valid('beklemede', 'onaylandi', 'iptal_edildi').default('beklemede')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'Geçerli bir aktif seçiniz'
        })
});

// Güncelleme için kullanılacak şema
const kasaHareketiUpdateSchema = kasaHareketiSchema.fork(
    ['islem_tipi', 'tutar', 'odeme_tipi', 'aciklama', 'personel_id', 'kategori'],
    (schema) => schema.optional()
);

module.exports = {
    kasaHareketiSchema,
    kasaHareketiUpdateSchema
}; 