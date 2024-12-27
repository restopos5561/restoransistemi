const BaseController = require('./BaseController');
const SiparisDurumGecmisi = require('../models/SiparisDurumGecmisi');

class SiparisDurumGecmisiController extends BaseController {
    // Sipariş durum geçmişi listesi
    static async getSiparisDurumGecmisi(req, res) {
        try {
            const { siparis_id, baslangic_tarihi, bitis_tarihi, durum, personel_id } = req.query;
            const gecmis = await SiparisDurumGecmisi.getAll({
                siparis_id,
                baslangic_tarihi,
                bitis_tarihi,
                durum,
                personel_id
            });
            return res.json(this.success(gecmis));
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Sipariş durum geçmişi detayı
    static async getSiparisDurumGecmisiDetay(req, res) {
        try {
            const { id } = req.params;
            const gecmis = await SiparisDurumGecmisi.getById(id);
            if (!gecmis) {
                return res.status(404).json(this.notFound('Sipariş durum geçmişi bulunamadı'));
            }
            return res.json(this.success(gecmis));
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Sipariş durum geçmişi oluştur
    static async createSiparisDurumGecmisi(req, res) {
        try {
            const { siparis_id, durum, aciklama, personel_id } = req.body;
            const gecmis = await SiparisDurumGecmisi.create({
                siparis_id,
                durum,
                aciklama,
                personel_id: personel_id || req.user.id
            });
            return res.status(201).json(this.success(gecmis, 'Sipariş durum geçmişi oluşturuldu'));
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Sipariş durum geçmişi güncelle
    static async updateSiparisDurumGecmisi(req, res) {
        try {
            const { id } = req.params;
            const { siparis_id, durum, aciklama, personel_id } = req.body;
            
            const gecmis = await SiparisDurumGecmisi.getById(id);
            if (!gecmis) {
                return res.status(404).json(this.notFound('Sipariş durum geçmişi bulunamadı'));
            }

            const updatedGecmis = await SiparisDurumGecmisi.update(id, {
                siparis_id,
                durum,
                aciklama,
                personel_id
            });
            return res.json(this.success(updatedGecmis, 'Sipariş durum geçmişi güncellendi'));
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Sipariş durum geçmişi sil
    static async deleteSiparisDurumGecmisi(req, res) {
        try {
            const { id } = req.params;
            
            const gecmis = await SiparisDurumGecmisi.getById(id);
            if (!gecmis) {
                return res.status(404).json(this.notFound('Sipariş durum geçmişi bulunamadı'));
            }

            await SiparisDurumGecmisi.delete(id);
            return res.json(this.success(null, 'Sipariş durum geçmişi silindi'));
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Toplu sipariş durum geçmişi oluştur
    static async createTopluSiparisDurumGecmisi(req, res) {
        try {
            const { kayitlar } = req.body;
            const sonuclar = [];

            for (const kayit of kayitlar) {
                const gecmis = await SiparisDurumGecmisi.create({
                    ...kayit,
                    personel_id: kayit.personel_id || req.user.id
                });
                sonuclar.push(gecmis);
            }

            return res.status(201).json(
                this.success(sonuclar, 'Sipariş durum geçmişleri oluşturuldu')
            );
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }
}

module.exports = SiparisDurumGecmisiController; 