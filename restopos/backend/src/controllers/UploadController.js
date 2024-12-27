const BaseController = require('./BaseController');
const Upload = require('../models/Upload');

class UploadController extends BaseController {
    // Dosya yükle
    static async upload(req, res) {
        return this.tryCatch(req, res, async () => {
            const { file } = req;
            if (!file) {
                return this.error('Dosya bulunamadı', 400);
            }

            const data = await Upload.create({
                ...file,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Dosya başarıyla yüklendi', 201);
        });
    }

    // Dosya türüne göre yükle
    static async uploadByType(req, res) {
        return this.tryCatch(req, res, async () => {
            const { file } = req;
            const { tip } = req.body;

            if (!file) {
                return this.error('Dosya bulunamadı', 400);
            }

            // Dosya türüne göre hedef klasörü belirle
            let destination = 'uploads/';
            switch (tip) {
                case 'urun':
                    destination += 'urunler/';
                    break;
                case 'profil':
                    destination += 'profil/';
                    break;
                case 'logo':
                    destination += 'logo/';
                    break;
                default:
                    destination += 'diger/';
            }

            const data = await Upload.create({
                ...file,
                destination,
                kullanici_id: req.user.id,
                category: tip
            });

            return this.success(data, 'Dosya başarıyla yüklendi', 201);
        });
    }

    // Dosya bilgilerini getir
    static async getById(req, res) {
        return this.handleGet(req, res, Upload);
    }

    // Tüm dosyaları getir
    static async getAll(req, res) {
        return this.handleList(req, res, Upload);
    }

    // Dosya sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Upload);
    }

    // Dosya türüne göre getir
    static async getByType(req, res) {
        return this.tryCatch(req, res, async () => {
            const { type } = req.params;
            const data = await Upload.getByType(type);
            return this.success(data);
        });
    }

    // Kullanıcıya göre dosyaları getir
    static async getByUser(req, res) {
        return this.tryCatch(req, res, async () => {
            const { kullanici_id } = req.params;
            const data = await Upload.getByUser(kullanici_id);
            return this.success(data);
        });
    }

    // Dosya boyutuna göre getir
    static async getBySize(req, res) {
        return this.tryCatch(req, res, async () => {
            const { min_size, max_size } = req.query;
            const data = await Upload.getBySize(min_size, max_size);
            return this.success(data);
        });
    }

    // Dosya adına göre ara
    static async searchByName(req, res) {
        return this.tryCatch(req, res, async () => {
            const { query } = req.query;
            const data = await Upload.searchByName(query);
            return this.success(data);
        });
    }

    // Dosya istatistiklerini getir
    static async getStats(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Upload.getStats();
            return this.success(data);
        });
    }

    // Dosya meta verilerini güncelle
    static async updateMetadata(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { metadata } = req.body;
            
            const data = await Upload.updateMetadata(id, metadata, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Dosya meta verileri başarıyla güncellendi');
        });
    }

    // Dosya etiketlerini güncelle
    static async updateTags(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { tags } = req.body;
            
            const data = await Upload.updateTags(id, tags, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Dosya etiketleri başarıyla güncellendi');
        });
    }

    // Dosya açıklamasını güncelle
    static async updateDescription(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { description } = req.body;
            
            const data = await Upload.updateDescription(id, description, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Dosya açıklaması başarıyla güncellendi');
        });
    }

    // Dosya kategorisini güncelle
    static async updateCategory(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { category } = req.body;
            
            const data = await Upload.updateCategory(id, category, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Dosya kategorisi başarıyla güncellendi');
        });
    }
}

module.exports = UploadController; 