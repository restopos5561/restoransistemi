const BaseController = require('./BaseController');
const Bolge = require('../models/Bolge');

class BolgeController extends BaseController {
    // Tüm bölgeleri getir
    static async getAll(req, res) {
        return this.handleList(req, res, Bolge);
    }

    // Belirli bir bölgeyi getir
    static async getById(req, res) {
        return this.handleGet(req, res, Bolge);
    }

    // Yeni bölge oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Bolge.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Bölge başarıyla oluşturuldu', 201);
        });
    }

    // Bölge güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Bolge.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Bölge başarıyla güncellendi');
        });
    }

    // Bölge sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Bolge);
    }

    // Bölge durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await Bolge.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Bölge durumu başarıyla güncellendi');
        });
    }

    // Bölge sıralamasını güncelle
    static async updateSiralama(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { siralama } = req.body;
            
            const data = await Bolge.updateSiralama(id, siralama);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Bölge sıralaması başarıyla güncellendi');
        });
    }

    // Bölgeye ait masaları getir
    static async getMasalar(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Bolge.getMasalar(id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Bölge istatistiklerini getir
    static async getIstatistikler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            
            const data = await Bolge.getIstatistikler(id, baslangic_tarihi, bitis_tarihi);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Bölgeleri toplu güncelle
    static async bulkUpdate(req, res) {
        return this.tryCatch(req, res, async () => {
            const { bolgeler } = req.body;
            const data = await Bolge.bulkUpdate(bolgeler, req.user.id);
            return this.success(data, 'Bölgeler başarıyla güncellendi');
        });
    }
}

module.exports = BolgeController; 