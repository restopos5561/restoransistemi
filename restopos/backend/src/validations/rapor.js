const Joi = require('joi');

// temel tarih aralığı şeması
const tarihAralik = {
    baslangic_tarihi: Joi.date().iso().required().messages({
        'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
        'date.format': 'Başlangıç tarihi ISO formatında olmalıdır',
        'any.required': 'Başlangıç tarihi zorunludur'
    }),
    bitis_tarihi: Joi.date().iso().min(Joi.ref('baslangic_tarihi')).required().messages({
        'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
        'date.format': 'Bitiş tarihi ISO formatında olmalıdır',
        'date.min': 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
        'any.required': 'Bitiş tarihi zorunludur'
    })
};

// Satış raporu validasyonu
const satisRaporuSchema = {
    query: Joi.object({
        ...tarihAralik
    })
};

// Ürün raporu validasyonu
const urunRaporuSchema = {
    query: Joi.object({
        ...tarihAralik
    })
};

// personel raporu validasyonu
const personelRaporuSchema = {
    query: Joi.object({
        ...tarihAralik
    })
};

// Müşteri raporu validasyonu
const musteriRaporuSchema = {
    query: Joi.object({
        ...tarihAralik
    })
};

// masa raporu validasyonu
const masaRaporuSchema = {
    query: Joi.object({
        ...tarihAralik
    })
};

// Kurye raporu validasyonu
const kuryeRaporuSchema = {
    query: Joi.object({
        ...tarihAralik
    })
};

// Karşılaştırmalı rapor validasyonu
const karsilastirmaRaporuSchema = {
    query: Joi.object({
        baslangic_tarihi1: Joi.date().iso().required().messages({
            'date.base': 'Başlangıç tarihi 1 geçerli bir tarih olmalıdır',
            'date.format': 'Başlangıç tarihi 1 ISO formatında olmalıdır',
            'any.required': 'Başlangıç tarihi 1 zorunludur'
        }),
        bitis_tarihi1: Joi.date().iso().min(Joi.ref('baslangic_tarihi1')).required().messages({
            'date.base': 'Bitiş tarihi 1 geçerli bir tarih olmalıdır',
            'date.format': 'Bitiş tarihi 1 ISO formatında olmalıdır',
            'date.min': 'Bitiş tarihi 1 başlangıç tarihi 1\'den sonra olmalıdır',
            'any.required': 'Bitiş tarihi 1 zorunludur'
        }),
        baslangic_tarihi2: Joi.date().iso().required().messages({
            'date.base': 'Başlangıç tarihi 2 geçerli bir tarih olmalıdır',
            'date.format': 'Başlangıç tarihi 2 ISO formatında olmalıdır',
            'any.required': 'Başlangıç tarihi 2 zorunludur'
        }),
        bitis_tarihi2: Joi.date().iso().min(Joi.ref('baslangic_tarihi2')).required().messages({
            'date.base': 'Bitiş tarihi 2 geçerli bir tarih olmalıdır',
            'date.format': 'Bitiş tarihi 2 ISO formatında olmalıdır',
            'date.min': 'Bitiş tarihi 2 başlangıç tarihi 2\'den sonra olmalıdır',
            'any.required': 'Bitiş tarihi 2 zorunludur'
        })
    })
};

// rapor format validasyonu
const raporFormatSchema = {
    body: Joi.object({
        rapor_turu: Joi.string().required().valid(
            'satis', 'urun', 'personel', 'musteri', 'masa', 
            'kurye', 'karsilastirma', 'stok', 'kasa', 'mutfak', 'rezervasyon'
        ).messages({
            'string.base': 'rapor türü metin olmalıdır',
            'any.required': 'rapor türü zorunludur',
            'any.only': 'Geçersiz rapor türü'
        }),
        format: Joi.string().required().valid('pdf', 'excel', 'csv').messages({
            'string.base': 'Format metin olmalıdır',
            'any.required': 'Format zorunludur',
            'any.only': 'Geçersiz format'
        }),
        parametreler: Joi.object().required().messages({
            'object.base': 'Parametreler nesne olmalıdır',
            'any.required': 'Parametreler zorunludur'
        })
    })
};

// rapor şablon validasyonu
const raporSablonSchema = {
    body: Joi.object({
        sablon_adi: Joi.string().required().min(3).max(50).messages({
            'string.base': 'Şablon adı metin olmalıdır',
            'string.min': 'Şablon adı en az 3 karakter olmalıdır',
            'string.max': 'Şablon adı en fazla 50 karakter olmalıdır',
            'any.required': 'Şablon adı zorunludur'
        }),
        rapor_turu: Joi.string().required().valid(
            'satis', 'urun', 'personel', 'musteri', 'masa', 
            'kurye', 'karsilastirma', 'stok', 'kasa', 'mutfak', 'rezervasyon'
        ).messages({
            'string.base': 'rapor türü metin olmalıdır',
            'any.required': 'rapor türü zorunludur',
            'any.only': 'Geçersiz rapor türü'
        }),
        parametreler: Joi.object().required().messages({
            'object.base': 'Parametreler nesne olmalıdır',
            'any.required': 'Parametreler zorunludur'
        })
    })
};

module.exports = {
    satisRaporuSchema,
    urunRaporuSchema,
    personelRaporuSchema,
    musteriRaporuSchema,
    masaRaporuSchema,
    kuryeRaporuSchema,
    karsilastirmaRaporuSchema,
    raporFormatSchema,
    raporSablonSchema
}; 