const morgan = require('morgan');
const config = require('../config');

// Özel log formatı
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('user-id', (req) => req.user ? req.user.id : 'anonymous');

const format = config.env === 'production'
    ? ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
    : ':method :url :status :response-time ms - :res[content-length] :body';

const options = {
    skip: (req, res) => {
        // Healthcheck isteklerini loglama
        if (req.path === '/health') return true;
        // Başarılı istekleri production'da loglama
        if (config.env === 'production' && res.statusCode < 400) return true;
        return false;
    }
};

module.exports = morgan(format, options); 