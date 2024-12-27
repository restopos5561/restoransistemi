const BaseController = require('./BaseController');
const KasaHareketi = require('../models/KasaHareketi');

class KasaHareketiController extends BaseController {
    // Tüm kasa hareketlerini getir
    static async getAll(req, res) {
        return this.handleList(req, res, KasaHareketi);
    }

    // Belirli bir kasa hareketini getir
    static async getById(req, res) {
        return this.handleGet(req, res, KasaHareketi);
    }

    // Yeni kasa hareketi oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await KasaHareketi.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Kasa hareketi başarıyla oluşturuldu', 201);
        });
    }

    // Kasa hareketini güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await KasaHareketi.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Kasa hareketi başarıyla güncellendi');
        });
    }

    // Kasa hareketini sil
    static async delete(req, res) {
        return this.handleDelete(req, res, KasaHareketi);
    }

    // Tarihe göre kasa hareketlerini getir
    static async getByTarih(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await KasaHareketi.getByTarih(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Tipe göre kasa hareketlerini getir
    static async getByTip(req, res) {
        return this.tryCatch(req, res, async () => {
            const { tip } = req.params;
            const data = await KasaHareketi.getByTip(tip);
            return this.success(data);
        });
    }

    // Kullanıcıya göre kasa hareketlerini getir
    static async getByKullanici(req, res) {
        return this.tryCatch(req, res, async () => {
            const { kullanici_id } = req.params;
            const data = await KasaHareketi.getByKullanici(kullanici_id);
            return this.success(data);
        });
    }

    // Kasa bakiyesini getir
    static async getBakiye(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await KasaHareketi.getBakiye();
            return this.success(data);
        });
    }

    // Günlük kasa raporu
    static async getGunlukRapor(req, res) {
        return this.tryCatch(req, res, async () => {
            const { tarih } = req.query;
            const data = await KasaHareketi.getGunlukRapor(tarih);
            return this.success(data);
        });
    }

    // Kasa hareketi istatistiklerini getir
    static async getIstatistikler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await KasaHareketi.getIstatistikler(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Kasa açılış işlemi
    static async kasaAc(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_bakiye, aciklama } = req.body;
            const data = await KasaHareketi.kasaAc(baslangic_bakiye, aciklama, req.user.id);
            return this.success(data, 'Kasa başarıyla açıldı');
        });
    }

    // Kasa kapanış işlemi
    static async kasaKapat(req, res) {
        return this.tryCatch(req, res, async () => {
            const { bitis_bakiye, aciklama } = req.body;
            const data = await KasaHareketi.kasaKapat(bitis_bakiye, aciklama, req.user.id);
            return this.success(data, 'Kasa başarıyla kapatıldı');
        });
    }

    // Para çekme işlemi
    static async paraCek(req, res) {
        return this.tryCatch(req, res, async () => {
            const { tutar, aciklama } = req.body;
            const data = await KasaHareketi.paraCek(tutar, aciklama, req.user.id);
            return this.success(data, 'Para çekme işlemi başarıyla gerçekleştirildi');
        });
    }

    // Para yatırma işlemi
    static async paraYatir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { tutar, aciklama } = req.body;
            const data = await KasaHareketi.paraYatir(tutar, aciklama, req.user.id);
            return this.success(data, 'Para yatırma işlemi başarıyla gerçekleştirildi');
        });
    }

    // Kasa hareketi raporunu dışa aktar
    static async exportReport(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi, format } = req.query;
            const data = await KasaHareketi.exportReport(baslangic_tarihi, bitis_tarihi, format);
            return this.success(data);
        });
    }

    // Tarih aralığına göre kasa hareketlerini getir
    static async getByDateRange(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic, bitis } = req.query;
            const data = await KasaHareketi.getByDateRange(baslangic, bitis);
            return this.success(data);
        });
    }

    // Kasaya göre hareketleri getir
    static async getByKasa(req, res) {
        return this.tryCatch(req, res, async () => {
            const { kasaId } = req.params;
            const data = await KasaHareketi.getByKasa(kasaId);
            return this.success(data);
        });
    }
}

module.exports = KasaHareketiController; 