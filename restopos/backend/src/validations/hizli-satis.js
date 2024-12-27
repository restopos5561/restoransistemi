const Joi = require('joi');

const hizliSatisSchema = {
    create: Joi.object({
        kategori_id: Joi.number().required(),
        urun_id: Joi.number().required(),
        miktar: Joi.number().required(),
        tutar: Joi.number().required(),
        odeme_yontemi_id: Joi.number().required(),
        kullanici_id: Joi.number().required(),
        aciklama: Joi.string().allow('', null),
        aktif: Joi.string().valid('beklemede', 'hazirlaniyor', 'tamamlandi', 'iptal').default('beklemede')
    }),

    update: Joi.object({
        kategori_id: Joi.number(),
        urun_id: Joi.number(),
        miktar: Joi.number(),
        tutar: Joi.number(),
        odeme_yontemi_id: Joi.number(),
        kullanici_id: Joi.number(),
        aciklama: Joi.string().allow('', null),
        aktif: Joi.string().valid('beklemede', 'hazirlaniyor', 'tamamlandi', 'iptal')
    }),

    indirimUygula: Joi.object({
        indirim_tipi: Joi.string().valid('yuzde', 'tutar').required(),
        indirim_tutari: Joi.number().required(),
        aciklama: Joi.string().required(),
        kullanici_id: Joi.number().required()
    }),

    ikramUygula: Joi.object({
        urun_id: Joi.number().required(),
        miktar: Joi.number().required(),
        aciklama: Joi.string().required(),
        kullanici_id: Joi.number().required()
    }),

    updateDurum: Joi.object({
        aktif: Joi.string().valid('beklemede', 'hazirlaniyor', 'tamamlandi', 'iptal').required()
    }),

    getByKategori: Joi.object({
        kategori_id: Joi.number().required()
    }),

    getByKullanici: Joi.object({
        kullanici_id: Joi.number().required()
    }),

    getByTarih: Joi.object({
        baslangic_tarihi: Joi.date().required(),
        bitis_tarihi: Joi.date().required()
    }),

    getIstatistikler: Joi.object({
        baslangic_tarihi: Joi.date().required(),
        bitis_tarihi: Joi.date().required()
    }),

    fisYazdir: Joi.object({
        yazici_id: Joi.number().required()
    })
};

module.exports = hizliSatisSchema; 