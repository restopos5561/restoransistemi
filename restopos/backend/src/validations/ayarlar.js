const Joi = require('joi');

// Temel ayar şeması
const ayarSchema = Joi.object({
    isletme_adi: Joi.string().required()
        .messages({
            'string.base': 'İşletme adı metin olmalıdır',
            'any.required': 'İşletme adı zorunludur'
        }),

    adres: Joi.string().required()
        .messages({
            'string.base': 'Adres metin olmalıdır',
            'any.required': 'Adres zorunludur'
        }),

    telefon: Joi.string().pattern(/^[0-9]{10}$/).required()
        .messages({
            'string.base': 'Telefon metin olmalıdır',
            'string.pattern.base': 'Telefon 10 haneli olmalıdır',
            'any.required': 'Telefon zorunludur'
        }),

    vergi_dairesi: Joi.string().required()
        .messages({
            'string.base': 'Vergi dairesi metin olmalıdır',
            'any.required': 'Vergi dairesi zorunludur'
        }),

    vergi_no: Joi.string().required()
        .messages({
            'string.base': 'Vergi no metin olmalıdır',
            'any.required': 'Vergi no zorunludur'
        }),

    logo_url: Joi.string().uri()
        .messages({
            'string.base': 'Logo URL metin olmalıdır',
            'string.uri': 'Geçerli bir URL girilmelidir'
        }),

    para_birimi: Joi.string().valid('TRY', 'USD', 'EUR').default('TRY')
        .messages({
            'string.base': 'Para birimi metin olmalıdır',
            'any.only': 'Para birimi TRY, USD veya EUR olmalıdır'
        }),

    dil: Joi.string().valid('tr', 'en').default('tr')
        .messages({
            'string.base': 'Dil metin olmalıdır',
            'any.only': 'Dil tr veya en olmalıdır'
        }),

    tema: Joi.string().valid('acik', 'koyu').default('acik')
        .messages({
            'string.base': 'Tema metin olmalıdır',
            'any.only': 'Tema acik veya koyu olmalıdır'
        })
});

// Yazıcı ayarları şeması
const yaziciAyarlarSchema = Joi.object({
    adisyon_yazici: Joi.string().required(),
    mutfak_yazici: Joi.string().required(),
    rapor_yazici: Joi.string().required(),
    otomatik_yazdir: Joi.boolean().default(false)
}).messages({
    'object.base': 'Yazıcı ayarları obje olmalıdır'
});

// Bildirim ayarları şeması
const bildirimAyarlarSchema = Joi.object({
    masaustu_bildirimleri: Joi.boolean().default(true),
    email_bildirimleri: Joi.boolean().default(false),
    sms_bildirimleri: Joi.boolean().default(false)
}).messages({
    'object.base': 'Bildirim ayarları obje olmalıdır'
});

// Sistem ayarları şeması
const sistemAyarlarSchema = Joi.object({
    email_ayarlari: Joi.object({
        smtp_sunucu: Joi.string().required(),
        smtp_port: Joi.number().required(),
        smtp_kullanici: Joi.string().required(),
        smtp_sifre: Joi.string().required(),
        gonderen_email: Joi.string().email().required()
    }),
    sms_ayarlari: Joi.object({
        api_key: Joi.string().required(),
        api_secret: Joi.string().required(),
        gonderen_baslik: Joi.string().required()
    }),
    yedekleme_ayarlari: Joi.object({
        otomatik_yedekleme: Joi.boolean().default(false),
        yedekleme_siklik: Joi.string().valid('gunluk', 'haftalik', 'aylik'),
        yedekleme_zamani: Joi.string(),
        yedekleme_konumu: Joi.string()
    })
}).messages({
    'object.base': 'Sistem ayarları obje olmalıdır'
});

// Ana ayarlar şeması ve alt şemaları
const ayarlarSchema = {
    // Tek bir ayarı getirmek için
    getByKey: Joi.object({
        key: Joi.string().required()
            .messages({
                'string.base': 'Ayar anahtarı metin olmalıdır',
                'any.required': 'Ayar anahtarı zorunludur'
            })
    }),

    // Tek bir ayarı güncellemek için
    update: Joi.object({
        key: Joi.string().required()
            .messages({
                'string.base': 'Ayar anahtarı metin olmalıdır',
                'any.required': 'Ayar anahtarı zorunludur'
            }),
        value: Joi.any().required()
            .messages({
                'any.required': 'Ayar değeri zorunludur'
            })
    }),

    // Birden fazla ayarı güncellemek için
    updateMultiple: Joi.object({
        ayarlar: Joi.array().items(
            Joi.object({
                key: Joi.string().required(),
                value: Joi.any().required()
            })
        ).min(1).required()
            .messages({
                'array.base': 'Ayarlar bir dizi olmalıdır',
                'array.min': 'En az bir ayar gönderilmelidir',
                'any.required': 'Ayarlar zorunludur'
            })
    })
};

module.exports = {
    ayarlarSchema,
    yaziciAyarlarSchema,
    bildirimAyarlarSchema,
    sistemAyarlarSchema
}; 