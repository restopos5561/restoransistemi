const BaseController = require('./BaseController');
const Masa = require('../models/Masa');

class MasaController extends BaseController {
    // Tüm masaları getir
    static async getAll(req, res) {
        return this.handleList(req, res, Masa);
    }

    // Belirli bir masayı getir
    static async getById(req, res) {
        return this.handleGet(req, res, Masa);
    }

    // Yeni masa oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Masa.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Masa başarıyla oluşturuldu', 201);
        });
    }

    // Masa güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Masa.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Masa başarıyla güncellendi');
        });
    }

    // Masa sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Masa);
    }

    // Bölgeye göre masaları getir
    static async getByBolge(req, res) {
        return this.tryCatch(req, res, async () => {
            const { bolge_id } = req.params;
            const data = await Masa.getByBolge(bolge_id);
            return this.success(data);
        });
    }

    // Duruma göre masaları getir
    static async getByDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { durum } = req.params;
            const data = await Masa.getByDurum(durum);
            return this.success(data);
        });
    }

    // Boş masaları getir
    static async getBosMasalar(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Masa.getBosMasalar();
            return this.success(data);
        });
    }

    // Dolu masaları getir
    static async getDoluMasalar(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Masa.getDoluMasalar();
            return this.success(data);
        });
    }

    // Masa durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await Masa.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Masa durumu başarıyla güncellendi');
        });
    }

    // Masa birleştir
    static async birlestir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { ana_masa_id, birlestirilecek_masa_id } = req.body;
            
            const data = await Masa.birlestir(ana_masa_id, birlestirilecek_masa_id, req.user.id);
            return this.success(data, 'Masalar başarıyla birleştirildi');
        });
    }

    // Masa ayır
    static async ayir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            
            const data = await Masa.ayir(id, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Masa başarıyla ayrıldı');
        });
    }

    // Masa taşı
    static async tasi(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { hedef_masa_id } = req.body;
            
            const data = await Masa.tasi(id, hedef_masa_id, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Masa başarıyla taşındı');
        });
    }

    // Masa rezervasyonlarını getir
    static async getRezervasyonlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Masa.getRezervasyonlar(id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Masa istatistiklerini getir
    static async getIstatistikler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            
            const data = await Masa.getIstatistikler(id, baslangic_tarihi, bitis_tarihi);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Masa adisyonlarını getir
    static async getAdisyonlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.query;
            
            let data;
            if (durum === 'aktif') {
                data = await Masa.getAktifAdisyonlar(id);
            } else {
                data = await Masa.getTumAdisyonlar(id);
            }
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Rezervasyon yap
    static async rezervasyonYap(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const rezervasyonData = req.body;
            
            // Rezervasyon işlemlerini gerçekleştir
            const data = await Masa.rezervasyonYap(id, {
                ...rezervasyonData,
                kullanici_id: req.user.id
            });
            
            return this.success(data, 'Rezervasyon başarıyla oluşturuldu');
        });
    }
}

module.exports = MasaController; 