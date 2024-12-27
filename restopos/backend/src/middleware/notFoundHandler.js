/**
 * 404 hata işleyici middleware
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'İstenen kaynak bulunamadı',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    notFoundHandler
}; 