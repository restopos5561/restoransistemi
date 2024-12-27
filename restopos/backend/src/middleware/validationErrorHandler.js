const BaseController = require('../controllers/BaseController');

const validationErrorHandler = (err, req, res, next) => {
    if (err && err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        
        return res.status(422).json(
            BaseController.validationError(errors)
        );
    }

    if (err && err.name === 'JsonSchemaValidationError') {
        const errors = err.validationErrors.map(error => ({
            field: error.path.join('.'),
            message: error.message
        }));

        return res.status(422).json(
            BaseController.validationError(errors)
        );
    }

    next(err);
};

module.exports = validationErrorHandler; 