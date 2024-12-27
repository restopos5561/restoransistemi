const Joi = require('joi');

const kullaniciSchema = {
    create: Joi.object({
        ad: Joi.string().required().min(2).max(50),
        soyad: Joi.string().required().min(2).max(50),
        email: Joi.string().email().required(),
        sifre: Joi.string().required().min(6),
        rol: Joi.string().valid('admin', 'garson', 'kasiyer', 'mutfak').required(),
        aktif: Joi.string().valid('aktif', 'pasif').default('aktif')
    }),

    update: Joi.object({
        ad: Joi.string().min(2).max(50),
        soyad: Joi.string().min(2).max(50),
        email: Joi.string().email(),
        rol: Joi.string().valid('admin', 'garson', 'kasiyer', 'mutfak'),
        aktif: Joi.string().valid('aktif', 'pasif')
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        sifre: Joi.string().required()
    }),

    changePassword: Joi.object({
        eski_sifre: Joi.string().required(),
        yeni_sifre: Joi.string().required().min(6)
    })
};

module.exports = kullaniciSchema; 