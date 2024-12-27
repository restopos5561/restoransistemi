const BaseController = require('./BaseController');
const FiyatDegisiklikLog = require('../models/FiyatDegisiklikLog');

class FiyatDegisiklikLogController extends BaseController {
    // Tüm fiyat değişiklik loglarını getir
    static async getAll(req, res) {
        return this.handleList(req, res, FiyatDegisiklikLog);
    }

    // Belirli bir fiyat değişiklik logunu getir
    static async getById(req, res) {
        return this.handleGet(req, res, FiyatDegisiklikLog);
    }

    // Yeni fiyat değişiklik logu oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await FiyatDegisiklikLog.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Fiyat değişiklik logu başarıyla oluşturuldu', 201);
        });
    }

    // Fiyat değişiklik logunu güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await FiyatDegisiklikLog.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Fiyat değişiklik logu başarıyla güncellendi');
        });
    }

    // Fiyat değişiklik logunu sil
    static async delete(req, res) {
        return this.handleDelete(req, res, FiyatDegisiklikLog);
    }

    // Ürüne göre fiyat değişiklik loglarını getir
    static async getByUrun(req, res) {
        return this.tryCatch(req, res, async () => {
            const { urun_id } = req.params;
            const data = await FiyatDegisiklikLog.getByUrun(urun_id);
            return this.success(data);
        });
    }

    // Kullanıcıya göre fiyat değişiklik loglarını getir
    static async getByKullanici(req, res) {
        return this.tryCatch(req, res, async () => {
            const { kullanici_id } = req.params;
            const data = await FiyatDegisiklikLog.getByKullanici(kullanici_id);
            return this.success(data);
        });
    }

    // Tarihe göre fiyat değişiklik loglarını getir
    static async getByTarih(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await FiyatDegisiklikLog.getByTarih(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Fiyat değişiklik istatistiklerini getir
    static async getIstatistikler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await FiyatDegisiklikLog.getIstatistikler(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Toplu fiyat değişiklik logu oluştur
    static async topluOlustur(req, res) {
        return this.tryCatch(req, res, async () => {
            const { loglar } = req.body;
            const data = await FiyatDegisiklikLog.topluOlustur(loglar, req.user.id);
            return this.success(data, 'Fiyat değişiklik logları başarıyla oluşturuldu');
        });
    }

    // Fiyat değişiklik raporunu dışa aktar
    static async exportReport(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi, format } = req.query;
            const data = await FiyatDegisiklikLog.exportReport(baslangic_tarihi, bitis_tarihi, format);
            return this.success(data);
        });
    }

    // Kategoriye göre fiyat değişiklik loglarını getir
    static async getByKategori(req, res) {
        try {
            const { kategoriId } = req.params;
            const data = await FiyatDegisiklikLog.getByKategori(kategoriId);
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Tarih aralığına göre fiyat değişiklik loglarını getir
    static async getByTarihAralik(req, res) {
        try {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await FiyatDegisiklikLog.getByTarih(baslangic_tarihi, bitis_tarihi);
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }
}

module.exports = FiyatDegisiklikLogController; 