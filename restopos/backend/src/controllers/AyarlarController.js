const BaseController = require('./BaseController');
const Ayarlar = require('../models/Ayarlar');

class AyarlarController extends BaseController {
    // Tüm ayarları getir
    static async getAll(req, res) {
        return this.handleList(req, res, Ayarlar);
    }

    // Belirli bir ayarı getir
    static async getByKey(req, res) {
        return this.tryCatch(req, res, async () => {
            const { key } = req.params;
            const data = await Ayarlar.getValue(key);
            
            if (!data) {
                return this.notFound('Ayar bulunamadı');
            }
            
            return this.success(data);
        });
    }

    // Tek bir ayarı güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { key } = req.params;
            const { value } = req.body;
            
            const data = await Ayarlar.setValue(key, value);
            return this.success(data, 'Ayar başarıyla güncellendi');
        });
    }

    // Birden fazla ayarı güncelle
    static async updateMultiple(req, res) {
        return this.tryCatch(req, res, async () => {
            const { ayarlar } = req.body;
            const data = await Ayarlar.bulkUpdate(ayarlar);
            return this.success(data, 'Ayarlar başarıyla güncellendi');
        });
    }

    // Yazıcı ayarlarını getir
    static async getYaziciAyarlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Ayarlar.getYaziciAyarlari();
            return this.success(data);
        });
    }

    // Yazıcı ayarlarını güncelle
    static async updateYaziciAyarlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Ayarlar.updateYaziciAyarlari(req.body);
            return this.success(data, 'Yazıcı ayarları başarıyla güncellendi');
        });
    }

    // Bildirim ayarlarını getir
    static async getBildirimAyarlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Ayarlar.getBildirimAyarlari();
            return this.success(data);
        });
    }

    // Bildirim ayarlarını güncelle
    static async updateBildirimAyarlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Ayarlar.updateBildirimAyarlari(req.body);
            return this.success(data, 'Bildirim ayarları başarıyla güncellendi');
        });
    }

    // Sistem ayarlarını getir
    static async getSistemAyarlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Ayarlar.getSistemAyarlari();
            return this.success(data);
        });
    }

    // Sistem ayarlarını güncelle
    static async updateSistemAyarlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Ayarlar.updateSistemAyarlari(req.body);
            return this.success(data, 'Sistem ayarları başarıyla güncellendi');
        });
    }
}

module.exports = AyarlarController; 