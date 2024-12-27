const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dosya yükleme için storage konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        
        // Uploads klasörü yoksa oluştur
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Alt klasörleri oluştur
        const type = req.params.type || 'other';
        const typeDir = path.join(uploadDir, type);
        
        if (!fs.existsSync(typeDir)) {
            fs.mkdirSync(typeDir, { recursive: true });
        }
        
        cb(null, typeDir);
    },
    filename: function (req, file, cb) {
        // Benzersiz dosya adı oluştur
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
    // İzin verilen dosya tipleri
    const allowedTypes = {
        'image': /^image\/(jpeg|jpg|png|gif)$/,
        'document': /^application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/,
        'excel': /^application\/(vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/
    };
    
    const type = req.params.type || 'other';
    
    if (type in allowedTypes) {
        if (allowedTypes[type].test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Geçersiz dosya tipi. Yalnızca ' + type + ' dosyaları yüklenebilir.'), false);
        }
    } else {
        // Diğer dosya tipleri için genel kontrol
        const isValid = Object.values(allowedTypes).some(regex => regex.test(file.mimetype));
        if (isValid) {
            cb(null, true);
        } else {
            cb(new Error('Geçersiz dosya tipi.'), false);
        }
    }
};

// Dosya boyutu limitleri (bytes)
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maksimum dosya sayısı
};

// Multer konfigürasyonu
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

// Hata yakalama middleware'i
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'Dosya boyutu çok büyük. Maksimum 5MB yüklenebilir.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Çok fazla dosya. En fazla 5 dosya yüklenebilir.'
            });
        }
        return res.status(400).json({ error: err.message });
    }
    
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    
    next();
};

// Dosya silme fonksiyonu
const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = {
    upload,
    handleUploadError,
    deleteFile
}; 