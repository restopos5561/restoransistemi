const BaseController = require('./BaseController');
const Rapor = require('../models/Rapor');

class RaporController extends BaseController {
    // Satış raporu
    static async getSatisRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rapor.getSatisRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Ürün raporu
    static async getUrunRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rapor.getUrunRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Personel raporu
    static async getPersonelRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rapor.getPersonelRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Müşteri raporu
    static async getMusteriRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rapor.getMusteriRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Masa raporu
    static async getMasaRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rapor.getMasaRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Kurye raporu
    static async getKuryeRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rapor.getKuryeRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Karşılaştırmalı rapor
    static async getKarsilastirmaRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi1, bitis_tarihi1, baslangic_tarihi2, bitis_tarihi2 } = req.query;
            const data = await Rapor.getKarsilastirmaRaporu(
                baslangic_tarihi1, 
                bitis_tarihi1, 
                baslangic_tarihi2, 
                bitis_tarihi2
            );
            return this.success(data);
        });
    }

    // Stok raporu
    static async getStokRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Rapor.getStokRaporu();
            return this.success(data);
        });
    }

    // Kasa raporu
    static async getKasaRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rapor.getKasaRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Mutfak raporu
    static async getMutfakRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rapor.getMutfakRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Rezervasyon raporu
    static async getRezervasyonRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Rapor.getRezervasyonRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Rapor dışa aktarma
    static async exportRapor(req, res) {
        return this.tryCatch(req, res, async () => {
            const { rapor_turu, format, parametreler } = req.body;
            const data = await Rapor.exportRapor(rapor_turu, format, parametreler);
            return this.success(data);
        });
    }

    // Rapor şablonları
    static async getSablonlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Rapor.getSablonlar();
            return this.success(data);
        });
    }

    static async createSablon(req, res) {
        return this.tryCatch(req, res, async () => {
            const { sablon_adi, rapor_turu, parametreler } = req.body;
            const data = await Rapor.createSablon(sablon_adi, rapor_turu, parametreler, req.user.id);
            return this.success(data, 'Rapor şablonu başarıyla oluşturuldu');
        });
    }

    static async updateSablon(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { sablon_adi, rapor_turu, parametreler } = req.body;
            const data = await Rapor.updateSablon(id, sablon_adi, rapor_turu, parametreler);
            return this.success(data, 'Rapor şablonu başarıyla güncellendi');
        });
    }

    static async deleteSablon(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            await Rapor.deleteSablon(id);
            return this.success(null, 'Rapor şablonu başarıyla silindi');
        });
    }
}

module.exports = RaporController; 