const Joi = require('joi');

// Login validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Geçerli bir email adresi giriniz',
        'any.required': 'Email adresi zorunludur'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Şifre en az 6 karakter olmalıdır',
        'any.required': 'Şifre zorunludur'
    })
});

// Register validation schema
const registerSchema = Joi.object({
    ad: Joi.string().required().messages({
        'any.required': 'Ad zorunludur'
    }),
    soyad: Joi.string().required().messages({
        'any.required': 'Soyad zorunludur'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Geçerli bir email adresi giriniz',
        'any.required': 'Email adresi zorunludur'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Şifre en az 6 karakter olmalıdır',
        'any.required': 'Şifre zorunludur'
    }),
    telefon: Joi.string().pattern(/^[0-9]{10}$/).messages({
        'string.pattern.base': 'Telefon numarası 10 haneli olmalıdır'
    }),
    rol_id: Joi.number().required().messages({
        'any.required': 'Rol zorunludur'
    })
});

// Validation middleware functions
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.details[0].message
        });
    }
    next();
};

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.details[0].message
        });
    }
    next();
};

module.exports = {
    validateLogin,
    validateRegister
}; 