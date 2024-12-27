const Joi = require('joi');

const kuryeSchema = {
    create: Joi.object({
        ad: Joi.string().required().min(2).max(50),
        soyad: Joi.string().required().min(2).max(50),
        telefon: Joi.string().required().pattern(/^[0-9]{10}$/),
        aktif: Joi.string().valid('aktif', 'pasif', 'izinli').default('aktif'),
        notlar: Joi.string().allow('', null)
    }),

    update: Joi.object({
        ad: Joi.string().min(2).max(50),
        soyad: Joi.string().min(2).max(50),
        telefon: Joi.string().pattern(/^[0-9]{10}$/),
        aktif: Joi.string().valid('aktif', 'pasif', 'izinli'),
        notlar: Joi.string().allow('', null)
    }),

    updateDurum: Joi.object({
        aktif: Joi.string().valid('aktif', 'pasif', 'izinli').required()
    })
};

module.exports = kuryeSchema; 