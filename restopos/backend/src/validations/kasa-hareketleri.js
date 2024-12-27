const Joi = require('joi');

const kasaHareketleriSchema = {
    create: Joi.object({
        islem_tipi: Joi.string().valid('giris', 'cikis').required(),
        tutar: Joi.number().required(),
        aciklama: Joi.string().required(),
        odeme_yontemi_id: Joi.number().required(),
        kullanici_id: Joi.number().required(),
        belge_no: Joi.string().allow('', null),
        aktif: Joi.string().valid('beklemede', 'onaylandi', 'reddedildi').default('beklemede')
    }),

    update: Joi.object({
        islem_tipi: Joi.string().valid('giris', 'cikis'),
        tutar: Joi.number(),
        aciklama: Joi.string(),
        odeme_yontemi_id: Joi.number(),
        kullanici_id: Joi.number(),
        belge_no: Joi.string().allow('', null),
        aktif: Joi.string().valid('beklemede', 'onaylandi', 'reddedildi')
    }),

    updateDurum: Joi.object({
        aciklama: Joi.string().required()
    }),

    getByTarih: Joi.object({
        baslangic_tarihi: Joi.date().required(),
        bitis_tarihi: Joi.date().required()
    }),

    getByKullanici: Joi.object({
        kullanici_id: Joi.number().required()
    }),

    getByIslemTipi: Joi.object({
        islem_tipi: Joi.string().valid('giris', 'cikis').required()
    }),

    getOzet: Joi.object({
        baslangic_tarihi: Joi.date(),
        bitis_tarihi: Joi.date()
    })
};

module.exports = kasaHareketleriSchema; 