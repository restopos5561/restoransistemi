const BaseController = require('./BaseController');
const Lisans = require('../models/Lisans');

class LisansController extends BaseController {
    // Tüm lisansları getir
    static async getAll(req, res) {
        return this.handleList(req, res, Lisans);
    }

    // Belirli bir lisansı getir
    static async getById(req, res) {
        return this.handleGet(req, res, Lisans);
    }

    // Yeni lisans oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Lisans.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Lisans başarıyla oluşturuldu', 201);
        });
    }

    // Lisans güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Lisans.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Lisans başarıyla güncellendi');
        });
    }

    // Lisans sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Lisans);
    }

    // Lisans durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await Lisans.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Lisans durumu başarıyla güncellendi');
        });
    }

    // Lisans anahtarını doğrula
    static async validateKey(req, res) {
        return this.tryCatch(req, res, async () => {
            const { lisans_anahtari } = req.body;
            const data = await Lisans.validateKey(lisans_anahtari);
            return this.success(data);
        });
    }

    // Lisans süresini uzat
    static async uzat(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { sure } = req.body;
            
            const data = await Lisans.uzat(id, sure, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Lisans süresi başarıyla uzatıldı');
        });
    }

    // Lisans istatistiklerini getir
    static async getIstatistikler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Lisans.getIstatistikler(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Lisans durumunu kontrol et
    static async checkDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Lisans.checkDurum();
            return this.success(data);
        });
    }

    // Lisans yenileme bildirimi gönder
    static async sendYenilemeBildirimi(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Lisans.sendYenilemeBildirimi(id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Yenileme bildirimi başarıyla gönderildi');
        });
    }

    // Lisans aktivasyonu yap
    static async aktivasyonYap(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Lisans.aktivasyonYap(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Lisans aktivasyonu başarıyla yapıldı');
        });
    }

    // Lisans yenileme
    static async yenile(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Lisans.yenile(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Lisans başarıyla yenilendi');
        });
    }

    // Lisans iptal
    static async iptalEt(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Lisans.iptalEt(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Lisans başarıyla iptal edildi');
        });
    }

    // Duruma göre lisansları getir
    static async getByDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { durum } = req.params;
            const data = await Lisans.getByDurum(durum);
            return this.success(data);
        });
    }

    // Müşteriye göre lisansları getir
    static async getByMusteri(req, res) {
        return this.tryCatch(req, res, async () => {
            const { musteriId } = req.params;
            const data = await Lisans.getByMusteri(musteriId);
            return this.success(data);
        });
    }

    // Lisans geçmişini getir
    static async getGecmis(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Lisans.getGecmis(id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }
}

module.exports = LisansController; 