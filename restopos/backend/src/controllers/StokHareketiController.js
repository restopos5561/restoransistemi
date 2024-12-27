const BaseController = require('./BaseController');
const StokHareketi = require('../models/StokHareketi');
const { validateSchema } = require('../validations/stok-hareketi');

class StokHareketiController extends BaseController {
    // Tüm stok hareketlerini getir
    static async getAll(req, res) {
        return this.handleList(req, res, StokHareketi);
    }

    // Belirli bir stok hareketini getir
    static async getById(req, res) {
        return this.handleGet(req, res, StokHareketi);
    }

    // Yeni stok hareketi oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await StokHareketi.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Stok hareketi başarıyla oluşturuldu', 201);
        });
    }

    // Stok hareketini güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await StokHareketi.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Stok hareketi başarıyla güncellendi');
        });
    }

    // Stok hareketini sil
    static async delete(req, res) {
        return this.handleDelete(req, res, StokHareketi);
    }

    // Ürüne göre stok hareketlerini getir
    static async getByUrun(req, res) {
        return this.tryCatch(req, res, async () => {
            const { urun_id } = req.params;
            const data = await StokHareketi.getByUrun(urun_id);
            return this.success(data);
        });
    }

    // Tarih aralığına göre stok hareketlerini getir
    static async getByDateRange(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic, bitis } = req.query;
            const data = await StokHareketi.getByDateRange(baslangic, bitis);
            return this.success(data);
        });
    }

    // Toplu stok girişi
    static async bulkCreate(req, res) {
        return this.tryCatch(req, res, async () => {
            const { hareketler } = req.body;
            const data = await StokHareketi.bulkCreate(hareketler, req.user.id);
            return this.success(data, 'Stok hareketleri başarıyla oluşturuldu', 201);
        });
    }

    // Stok sayımı
    static async stokSayimi(req, res) {
        return this.tryCatch(req, res, async () => {
            const { sayim_detaylari } = req.body;
            const data = await StokHareketi.stokSayimi(sayim_detaylari, req.user.id);
            return this.success(data, 'Stok sayımı başarıyla kaydedildi');
        });
    }

    // Depoya göre stok hareketlerini getir
    static async getByDepo(req, res) {
        return this.tryCatch(req, res, async () => {
            const { depoId } = req.params;
            const data = await StokHareketi.getByDepo(depoId);
            return this.success(data);
        });
    }
}

module.exports = StokHareketiController; 