const Joi = require('joi');

// Ortak şemalar
const schemas = {
    // temel tipler
    id: Joi.number().integer().positive(),
    uuid: Joi.string().uuid(),
    email: Joi.string().email(),
    telefon: Joi.string().pattern(/^[0-9]{10}$/),
    paraBirimi: Joi.string().valid('try', 'usd', 'eur'),
    tarih: Joi.date().iso(),
    limit: Joi.number().integer().min(1).max(100),
    offset: Joi.number().integer().min(0),
    
    // Ortak alanlar
    adSoyad: {
        ad: Joi.string().min(2).max(50).required(),
        soyad: Joi.string().min(2).max(50).required()
    },

    iletisimBilgileri: {
        telefon: Joi.string().pattern(/^[0-9]{10}$/),
        email: Joi.string().email(),
        adres: Joi.string().max(255)
    },

    paraBirimiTutar: {
        tutar: Joi.number().precision(2).positive().required(),
        para_birimi: Joi.string().valid('try', 'usd', 'eur').required()
    },

    paginasyon: {
        sayfa: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100)
    },

    filtreleme: {
        baslangic_tarihi: Joi.date().iso(),
        bitis_tarihi: Joi.date().iso().min(Joi.ref('baslangic_tarihi')),
        aktif: Joi.string(),
        siralama: Joi.string().valid('ASC', 'DESC')
    },

    // Ortak nesneler
    adres: Joi.object({
        il: Joi.string().required(),
        ilce: Joi.string().required(),
        mahalle: Joi.string().required(),
        sokak: Joi.string(),
        bina_no: Joi.string().required(),
        daire_no: Joi.string(),
        posta_kodu: Joi.string(),
        tarif: Joi.string()
    }),

    koordinat: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
    })
};

// Yardımcı fonksiyonlar
const helpers = {
    // Tarih aralığı kontrolü
    tarihAraligi: (from, to) => {
        return Joi.object({
            [from]: Joi.date().iso().required(),
            [to]: Joi.date().iso().min(Joi.ref(from)).required()
        });
    },

    // Sayfalama parametreleri
    sayfalama: (maxLimit = 100) => {
        return Joi.object({
            sayfa: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(maxLimit).default(10)
        });
    },

    // Sıralama parametreleri
    siralama: (fields) => {
        return Joi.object({
            siralama_alani: Joi.string().valid(...fields).required(),
            siralama_yonu: Joi.string().valid('ASC', 'DESC').default('ASC')
        });
    }
};

module.exports = {
    schemas,
    helpers
}; 