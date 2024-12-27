/**
 * Joi şeması ile validasyon yapar
 * @param {Object} schema - Joi şeması
 * @param {Object} data - Validate edilecek veri
 * @returns {Object} - { isValid: boolean, errors: array }
 */
function validateSchema(schema, data) {
    const { error } = schema.validate(data, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    });

    if (error) {
        return {
            isValid: false,
            errors: error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        };
    }

    return {
        isValid: true,
        errors: []
    };
}

module.exports = {
    validateSchema
}; 