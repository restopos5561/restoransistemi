const Joi = require('joi');
const { commonSchemas } = require('./common-schemas');

// Dosya yükleme şeması
const uploadSchema = Joi.object({
    file: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().integer().positive().required()
    }).required(),
    kullanici_id: Joi.number().integer().positive().required()
});

// Dosya türüne göre yükleme şeması
const uploadTipSchema = Joi.object({
    file: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().integer().positive().required()
    }).required(),
    tip: Joi.string().valid('urun', 'profil', 'logo', 'diger').required(),
    kullanici_id: Joi.number().integer().positive().required()
});

// Dosya silme şeması
const uploadSilSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

// Dosya meta veri güncelleme şeması
const updateMetadataSchema = Joi.object({
    metadata: Joi.object().required(),
    kullanici_id: Joi.number().integer().positive().required()
});

// Dosya etiket güncelleme şeması
const updateTagsSchema = Joi.object({
    tags: Joi.array().items(Joi.string()).required(),
    kullanici_id: Joi.number().integer().positive().required()
});

// Dosya açıklama güncelleme şeması
const updateDescriptionSchema = Joi.object({
    description: Joi.string().allow('').required(),
    kullanici_id: Joi.number().integer().positive().required()
});

// Dosya kategori güncelleme şeması
const updateCategorySchema = Joi.object({
    category: Joi.string().required(),
    kullanici_id: Joi.number().integer().positive().required()
});

// Dosya filtreleme şeması
const filterSchema = Joi.object({
    type: Joi.string(),
    min_size: Joi.number().integer().positive(),
    max_size: Joi.number().integer().positive(),
    search: Joi.string(),
    page: Joi.number().integer().positive(),
    limit: Joi.number().integer().positive()
}).with('min_size', 'max_size');

module.exports = {
    uploadSchema,
    uploadTipSchema,
    uploadSilSchema,
    updateMetadataSchema,
    updateTagsSchema,
    updateDescriptionSchema,
    updateCategorySchema,
    filterSchema
}; 