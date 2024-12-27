const BaseController = require('./BaseController');
const SiparisDetay = require('../models/SiparisDetay');
const { validateSchema } = require('../validations/siparis-detay');

class SiparisDetayController extends BaseController {
    // Tüm sipariş detaylarını getir
    static async getAll(req, res) {
        return this.handleList(req, res, SiparisDetay);
    }

    // Belirli bir sipariş detayını getir
    static async getById(req, res) {
        return this.handleGet(req, res, SiparisDetay);
    }

    // Yeni sipariş detayı oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await SiparisDetay.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Sipariş detayı başarıyla oluşturuldu', 201);
        });
    }

    // Sipariş detayını güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await SiparisDetay.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Sipariş detayı başarıyla güncellendi');
        });
    }

    // Sipariş detayını sil
    static async delete(req, res) {
        return this.handleDelete(req, res, SiparisDetay);
    }

    // Siparişe ait detayları getir
    static async getBySiparis(req, res) {
        return this.tryCatch(req, res, async () => {
            const { siparis_id } = req.params;
            const data = await SiparisDetay.getBySiparis(siparis_id);
            return this.success(data);
        });
    }

    // Ürüne ait sipariş detaylarını getir
    static async getByUrun(req, res) {
        return this.tryCatch(req, res, async () => {
            const { urun_id } = req.params;
            const data = await SiparisDetay.getByUrun(urun_id);
            return this.success(data);
        });
    }

    // Sipariş detayının durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await SiparisDetay.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Sipariş detayı durumu başarıyla güncellendi');
        });
    }

    // Sipariş detayına not ekle
    static async addNote(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { not } = req.body;
            
            const data = await SiparisDetay.addNote(id, not, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Not başarıyla eklendi');
        });
    }

    // Sipariş detayının notlarını getir
    static async getNotes(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await SiparisDetay.getNotes(id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Sipariş detayının notunu güncelle
    static async updateNot(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { notlar } = req.body;
            
            const data = await SiparisDetay.updateNot(id, notlar);
            
            if (!data) {
                return this.notFound('Sipariş detayı bulunamadı');
            }
            
            return this.success(data, 'Sipariş detayı notu başarıyla güncellendi');
        });
    }
}

module.exports = SiparisDetayController; 