const HizliSatis = require('../models/HizliSatis');

class HizliSatisController {
    static async create(req, res) {
        try {
            const result = await HizliSatis.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const result = await HizliSatis.update(req.params.id, req.body);
            if (!result) {
                return res.status(404).json({ error: 'Hızlı satış bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const result = await HizliSatis.delete(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Hızlı satış bulunamadı' });
            }
            res.json({ message: 'Hızlı satış başarıyla silindi' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const result = await HizliSatis.getById(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Hızlı satış bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByKategori(req, res) {
        try {
            const result = await HizliSatis.getByKategori(req.params.kategori_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByKullanici(req, res) {
        try {
            const result = await HizliSatis.getByKullanici(req.params.kullanici_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByTarih(req, res) {
        try {
            const { baslangic_tarihi, bitis_tarihi } = req.body;
            const result = await HizliSatis.getByTarih(baslangic_tarihi, bitis_tarihi);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getIstatistikler(req, res) {
        try {
            const { baslangic_tarihi, bitis_tarihi } = req.body;
            const result = await HizliSatis.getIstatistikler(baslangic_tarihi, bitis_tarihi);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getOzet(req, res) {
        try {
            const result = await HizliSatis.getOzet(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Hızlı satış bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async fisYazdir(req, res) {
        try {
            const result = await HizliSatis.fisYazdir(req.params.id, req.body.yazici_id);
            if (!result) {
                return res.status(404).json({ error: 'Hızlı satış bulunamadı' });
            }
            res.json({ message: 'Fiş başarıyla yazdırıldı' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async indirimUygula(req, res) {
        try {
            const result = await HizliSatis.indirimUygula(req.params.id, req.body);
            if (!result) {
                return res.status(404).json({ error: 'Hızlı satış bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async ikramUygula(req, res) {
        try {
            const result = await HizliSatis.ikramUygula(req.params.id, req.body);
            if (!result) {
                return res.status(404).json({ error: 'Hızlı satış bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateDurum(req, res) {
        try {
            const result = await HizliSatis.updateDurum(req.params.id, req.body.durum);
            if (!result) {
                return res.status(404).json({ error: 'Hızlı satış bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = HizliSatisController; 