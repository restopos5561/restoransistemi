const Joi = require('joi');

const dashboardSchema = {
    getPopulerUrunler: Joi.object({
        limit: Joi.number().integer().min(1).max(100).default(10)
    }),

    dashboardTarihSchema: Joi.object({
        baslangic_tarihi: Joi.date().required(),
        bitis_tarihi: Joi.date().min(Joi.ref('baslangic_tarihi')).required()
    }),

    dashboardKarsilastirmaSchema: Joi.object({
        baslangic_tarihi1: Joi.date().required(),
        bitis_tarihi1: Joi.date().min(Joi.ref('baslangic_tarihi1')).required(),
        baslangic_tarihi2: Joi.date().required(),
        bitis_tarihi2: Joi.date().min(Joi.ref('baslangic_tarihi2')).required()
    })
};

module.exports = dashboardSchema; 