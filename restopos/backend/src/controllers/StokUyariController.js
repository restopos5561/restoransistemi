const BaseController = require('./BaseController');
const StokUyari = require('../models/StokUyari');
const { validateSchema } = require('../validations/stok-uyari');

class StokUyariController extends BaseController {
    // Tüm stok uyarılarını getir
    static async getAll(req, res) {
        return this.handleList(req, res, StokUyari);
    }

    // Belirli bir stok uyarısını getir
    static async getById(req, res) {
        return this.handleGet(req, res, StokUyari);
    }

    // Yeni stok uyarısı oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await StokUyari.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Stok uyarısı başarıyla oluşturuldu', 201);
        });
    }

    // Stok uyarısını güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await StokUyari.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Stok uyarısı başarıyla güncellendi');
        });
    }

    // Stok uyarısını sil
    static async delete(req, res) {
        return this.handleDelete(req, res, StokUyari);
    }

    // Okunmamış uyarıları getir
    static async getUnread(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await StokUyari.getUnread();
            return this.success(data);
        });
    }

    // Uyarıyı okundu olarak işaretle
    static async markAsRead(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await StokUyari.markAsRead(id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Uyarı okundu olarak işaretlendi');
        });
    }

    // Tüm uyarıları okundu olarak işaretle
    static async markAllAsRead(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await StokUyari.markAllAsRead();
            return this.success(data, 'Tüm uyarılar okundu olarak işaretlendi');
        });
    }

    // Kritik stok seviyesindeki ürünleri kontrol et
    static async checkCriticalStock(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await StokUyari.checkCriticalStock();
            return this.success(data);
        });
    }
}

module.exports = StokUyariController; 