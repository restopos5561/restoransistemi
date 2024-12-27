const Joi = require('joi');

const paketSiparisSchema = Joi.object({
    musteri_id: Joi.number().integer()
        .messages({
            'number.base': 'Müşteri ID sayı olmalıdır',
            'number.integer': 'Müşteri ID tam sayı olmalıdır'
        }),
    adres: Joi.object({
        il: Joi.string().required()
            .messages({
                'string.base': 'İl metin olmalıdır',
                'any.required': 'İl zorunludur'
            }),
        ilce: Joi.string().required()
            .messages({
                'string.base': 'İlçe metin olmalıdır',
                'any.required': 'İlçe zorunludur'
            }),
        mahalle: Joi.string().required()
            .messages({
                'string.base': 'Mahalle metin olmalıdır',
                'any.required': 'Mahalle zorunludur'
            }),
        sokak: Joi.string().required()
            .messages({
                'string.base': 'Sokak metin olmalıdır',
                'any.required': 'Sokak zorunludur'
            }),
        bina_no: Joi.string().required()
            .messages({
                'string.base': 'Bina no metin olmalıdır',
                'any.required': 'Bina no zorunludur'
            }),
        daire_no: Joi.string()
            .messages({
                'string.base': 'Daire no metin olmalıdır'
            }),
        tarif: Joi.string()
            .messages({
                'string.base': 'Tarif metin olmalıdır'
            })
    }).required()
        .messages({
            'object.base': 'Adres bilgileri geçerli değil',
            'any.required': 'Adres bilgileri zorunludur'
        }),
    musteri_bilgileri: Joi.object({
        ad: Joi.string().required()
            .messages({
                'string.base': 'Ad metin olmalıdır',
                'any.required': 'Ad zorunludur'
            }),
        soyad: Joi.string().required()
            .messages({
                'string.base': 'Soyad metin olmalıdır',
                'any.required': 'Soyad zorunludur'
            }),
        telefon: Joi.string().required()
            .messages({
                'string.base': 'Telefon metin olmalıdır',
                'any.required': 'Telefon zorunludur'
            }),
        email: Joi.string().email()
            .messages({
                'string.base': 'Email metin olmalıdır',
                'string.email': 'Geçerli bir email adresi giriniz'
            })
    }).required()
        .messages({
            'object.base': 'Müşteri bilgileri geçerli değil',
            'any.required': 'Müşteri bilgileri zorunludur'
        }),
    urunler: Joi.array().items(
        Joi.object({
            urun_id: Joi.number().integer().required()
                .messages({
                    'number.base': 'Ürün ID sayı olmalıdır',
                    'number.integer': 'Ürün ID tam sayı olmalıdır',
                    'any.required': 'Ürün ID zorunludur'
                }),
            miktar: Joi.number().positive().required()
                .messages({
                    'number.base': 'Miktar sayı olmalıdır',
                    'number.positive': 'Miktar pozitif olmalıdır',
                    'any.required': 'Miktar zorunludur'
                }),
            notlar: Joi.string()
                .messages({
                    'string.base': 'Notlar metin olmalıdır'
                })
        })
    ).min(1).required()
        .messages({
            'array.base': 'Ürünler dizi olmalıdır',
            'array.min': 'en az bir ürün eklenmelidir',
            'any.required': 'Ürünler zorunludur'
        }),
    odeme_tipi: Joi.string().valid('nakit', 'kredi_karti', 'havale', 'diger').required()
        .messages({
            'string.base': 'Ödeme tipi metin olmalıdır',
            'any.only': 'Geçerli bir ödeme tipi seçiniz',
            'any.required': 'Ödeme tipi zorunludur'
        }),
    teslimat_notu: Joi.string()
        .messages({
            'string.base': 'Teslimat notu metin olmalıdır'
        }),
    kupon_kodu: Joi.string()
        .messages({
            'string.base': 'Kupon kodu metin olmalıdır'
        }),
    aktif: Joi.string().valid(
        'beklemede',
        'hazirlaniyor',
        'yolda',
        'teslim_edildi',
        'iptal'
    ).default('beklemede')
        .messages({
            'string.base': 'aktif metin olmalıdır',
            'any.only': 'Geçerli bir aktif seçiniz'
        })
});

module.exports = {
    paketSiparisSchema
}; 