const BaseController = require('./BaseController');
const Rezervasyon = require('../models/Rezervasyon');

class RezervasyonController extends BaseController {
    // Tüm rezervasyonları getir
    static async getAll(req, res) {
        return this.handleList(req, res, Rezervasyon);
    }

    // Belirli bir rezervasyonu getir
    static async getById(req, res) {
        return this.handleGet(req, res, Rezervasyon);
    }

    // Yeni rezervasyon oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Rezervasyon.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Rezervasyon başarıyla oluşturuldu', 201);
        });
    }

    // Rezervasyon güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Rezervasyon.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Rezervasyon başarıyla güncellendi');
        });
    }

    // Rezervasyon sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Rezervasyon);
    }

    // Rezervasyon durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await Rezervasyon.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Rezervasyon durumu başarıyla güncellendi');
        });
    }

    // Masaya göre rezervasyonları getir
    static async getByMasa(req, res) {
        return this.tryCatch(req, res, async () => {
            const { masa_id } = req.params;
            const data = await Rezervasyon.getByMasa(masa_id);
            return this.success(data);
        });
    }

    // Müşteriye göre rezervasyonları getir
    static async getByMusteri(req, res) {
        return this.tryCatch(req, res, async () => {
            const { musteri_id } = req.params;
            const data = await Rezervasyon.getByMusteri(musteri_id);
            return this.success(data);
        });
    }

    // Tarihe göre rezervasyonları getir
    static async getByTarih(req, res) {
        return this.tryCatch(req, res, async () => {
            const { tarih } = req.params;
            const data = await Rezervasyon.getByTarih(tarih);
            return this.success(data);
        });
    }

    // Bugünkü rezervasyonları getir
    static async getBugunku(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Rezervasyon.getBugunku();
            return this.success(data);
        });
    }

    // Gelecek rezervasyonları getir
    static async getGelecek(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Rezervasyon.getGelecek();
            return this.success(data);
        });
    }

    // Geçmiş rezervasyonları getir
    static async getGecmis(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Rezervasyon.getGecmis();
            return this.success(data);
        });
    }

    // Rezervasyon onaylama
    static async onayla(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Rezervasyon.onayla(id, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Rezervasyon başarıyla onaylandı');
        });
    }

    // Rezervasyon iptal etme
    static async iptalEt(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { iptal_nedeni } = req.body;
            
            const data = await Rezervasyon.iptalEt(id, iptal_nedeni, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Rezervasyon başarıyla iptal edildi');
        });
    }

    // Müsait masaları getir
    static async getMusaitMasalar(req, res) {
        return this.tryCatch(req, res, async () => {
            const { tarih, saat, kisi_sayisi } = req.query;
            const data = await Rezervasyon.getMusaitMasalar(tarih, saat, kisi_sayisi);
            return this.success(data);
        });
    }

    // Rezervasyon istatistiklerini getir
    static async getIstatistikler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rezervasyon.getIstatistikler(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Rezervasyon hatırlatma e-postası gönder
    static async sendHatirlatmaEmail(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Rezervasyon.sendHatirlatmaEmail(id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Hatırlatma e-postası başarıyla gönderildi');
        });
    }

    // Not güncelleme
    static async updateNot(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { not } = req.body;
            
            const data = await Rezervasyon.updateNot(id, not);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Rezervasyon notu başarıyla güncellendi');
        });
    }

    // Hatırlatma bekleyen rezervasyonları getir
    static async getHatirlatmaBekleyenler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Rezervasyon.getHatirlatmaBekleyenler();
            return this.success(data);
        });
    }
}

module.exports = RezervasyonController; 