const BaseController = require('./BaseController');
const Dashboard = require('../models/Dashboard');

class DashboardController extends BaseController {
    // Özet bilgileri getir
    static async getOzet(req, res) {
        try {
            const data = await Dashboard.getOzet();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Günlük özet
    static async getGunlukOzet(req, res) {
        try {
            const data = await Dashboard.getGunlukOzet();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Haftalık özet
    static async getHaftalikOzet(req, res) {
        try {
            const data = await Dashboard.getHaftalikOzet();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Aylık özet
    static async getAylikOzet(req, res) {
        try {
            const data = await Dashboard.getAylikOzet();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Satış istatistikleri
    static async getSatisIstatistikleri(req, res) {
        try {
            const data = await Dashboard.getSatisIstatistikleri();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Ürün istatistikleri
    static async getUrunIstatistikleri(req, res) {
        try {
            const data = await Dashboard.getUrunIstatistikleri();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Personel istatistikleri
    static async getPersonelIstatistikleri(req, res) {
        try {
            const data = await Dashboard.getPersonelIstatistikleri();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Müşteri istatistikleri
    static async getMusteriIstatistikleri(req, res) {
        try {
            const data = await Dashboard.getMusteriIstatistikleri();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Masa istatistikleri
    static async getMasaIstatistikleri(req, res) {
        try {
            const data = await Dashboard.getMasaIstatistikleri();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Kurye istatistikleri
    static async getKuryeIstatistikleri(req, res) {
        try {
            const data = await Dashboard.getKuryeIstatistikleri();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Tarih aralığına göre istatistikler
    static async getByTarihAralik(req, res) {
        try {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Dashboard.getByTarihAralik(baslangic_tarihi, bitis_tarihi);
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Karşılaştırmalı istatistikler
    static async getKarsilastirma(req, res) {
        try {
            const { 
                baslangic_tarihi1, 
                bitis_tarihi1,
                baslangic_tarihi2,
                bitis_tarihi2
            } = req.query;
            
            const data = await Dashboard.getKarsilastirma(
                baslangic_tarihi1,
                bitis_tarihi1,
                baslangic_tarihi2,
                bitis_tarihi2
            );
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Canlı istatistikler
    static async getCanliIstatistikler(req, res) {
        try {
            const data = await Dashboard.getCanliIstatistikler();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Canlı siparişler
    static async getCanliSiparisler(req, res) {
        try {
            const data = await Dashboard.getCanliSiparisler();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Canlı masa durumu
    static async getCanliMasaDurumu(req, res) {
        try {
            const data = await Dashboard.getCanliMasaDurumu();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Canlı mutfak durumu
    static async getCanliMutfakDurumu(req, res) {
        try {
            const data = await Dashboard.getCanliMutfakDurumu();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }

    // Canlı kurye durumu
    static async getCanliKuryeDurumu(req, res) {
        try {
            const data = await Dashboard.getCanliKuryeDurumu();
            return res.json(this.success(data));
        } catch (error) {
            console.error(error);
            return res.status(500).json(this.error(error.message));
        }
    }
}

module.exports = DashboardController; 