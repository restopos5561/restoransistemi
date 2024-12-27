const BaseController = require('./BaseController');
const AdisyonKalemi = require('../models/AdisyonKalemi');
const { validateSchema } = require('../validations/adisyon-kalemi');

class AdisyonKalemiController extends BaseController {
    // Tüm adisyon kalemlerini getir
    static async getAll(req, res) {
        return this.handleList(req, res, AdisyonKalemi);
    }

    // Belirli bir adisyon kalemini getir
    static async getById(req, res) {
        return this.handleGet(req, res, AdisyonKalemi);
    }

    // Yeni adisyon kalemi oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await AdisyonKalemi.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Adisyon kalemi başarıyla oluşturuldu', 201);
        });
    }

    // Adisyon kalemini güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await AdisyonKalemi.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon kalemi başarıyla güncellendi');
        });
    }

    // Adisyon kalemini sil
    static async delete(req, res) {
        return this.handleDelete(req, res, AdisyonKalemi);
    }

    // Adisyona ait kalemleri getir
    static async getByAdisyon(req, res) {
        return this.tryCatch(req, res, async () => {
            const { adisyon_id } = req.params;
            const data = await AdisyonKalemi.getByAdisyon(adisyon_id);
            return this.success(data);
        });
    }

    // Ürüne ait adisyon kalemlerini getir
    static async getByUrun(req, res) {
        return this.tryCatch(req, res, async () => {
            const { urun_id } = req.params;
            const data = await AdisyonKalemi.getByUrun(urun_id);
            return this.success(data);
        });
    }

    // İptal edilen adisyon kalemlerini getir
    static async getIptalEdilenler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await AdisyonKalemi.getIptalEdilenler();
            return this.success(data);
        });
    }

    // Adisyon kalemini iptal et
    static async iptalEt(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { iptal_nedeni } = req.body;
            
            const data = await AdisyonKalemi.iptalEt(id, iptal_nedeni, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon kalemi başarıyla iptal edildi');
        });
    }

    // İkram olarak işaretle
    static async ikramYap(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { ikram_nedeni } = req.body;
            
            const data = await AdisyonKalemi.ikramYap(id, ikram_nedeni, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon kalemi ikram olarak işaretlendi');
        });
    }

    // Adisyon kalemi durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await AdisyonKalemi.updateDurum(id, durum, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon kalemi durumu başarıyla güncellendi');
        });
    }

    // Adisyon kalemi miktarını güncelle
    static async updateMiktar(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { miktar } = req.body;
            
            const data = await AdisyonKalemi.updateMiktar(id, miktar, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon kalemi miktarı başarıyla güncellendi');
        });
    }

    // Adisyon kalemi notunu güncelle
    static async updateNot(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { not } = req.body;
            
            const data = await AdisyonKalemi.updateNot(id, not, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon kalemi notu başarıyla güncellendi');
        });
    }

    // Duruma göre adisyon kalemlerini getir
    static async getByDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { durum } = req.params;
            const data = await AdisyonKalemi.getByDurum(durum);
            return this.success(data);
        });
    }

    // Adisyon kalemi durum geçmişini getir
    static async getDurumGecmisi(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await AdisyonKalemi.getDurumGecmisi(id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }
}

module.exports = AdisyonKalemiController; 