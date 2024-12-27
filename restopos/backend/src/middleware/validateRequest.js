const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            // Request body'sini şemaya göre doğrula
            const { error } = schema.validate(req.body, {
                abortEarly: false, // Tüm hataları göster
                allowUnknown: true, // Bilinmeyen alanları kabul et
                stripUnknown: true // Bilinmeyen alanları temizle
            });

            if (error) {
                // Validasyon hataları varsa
                const errors = error.details.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                return res.status(400).json({
                    status: 'error',
                    message: 'Validasyon hatası',
                    errors: errors
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = validateRequest; 