const Joi = require('joi');

const kategoriSchema = {
    create: Joi.object({
        ad: Joi.string().required().min(2).max(100),
        aciklama: Joi.string().allow('', null)
    }),

    update: Joi.object({
        ad: Joi.string().min(2).max(100),
        aciklama: Joi.string().allow('', null)
    })
};

module.exports = kategoriSchema; 