const KasaHareketleri = require('../models/KasaHareketleri');

class KasaHareketleriController {
    static async create(req, res) {
        try {
            const result = await KasaHareketleri.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const result = await KasaHareketleri.update(req.params.id, req.body);
            if (!result) {
                return res.status(404).json({ error: 'Kasa hareketi bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const result = await KasaHareketleri.delete(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Kasa hareketi bulunamadı' });
            }
            res.json({ message: 'Kasa hareketi başarıyla silindi' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const result = await KasaHareketleri.getById(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Kasa hareketi bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByTarih(req, res) {
        try {
            const { baslangic_tarihi, bitis_tarihi } = req.body;
            const result = await KasaHareketleri.getByTarih(baslangic_tarihi, bitis_tarihi);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByKullanici(req, res) {
        try {
            const result = await KasaHareketleri.getByKullanici(req.params.kullanici_id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getByIslemTipi(req, res) {
        try {
            const result = await KasaHareketleri.getByIslemTipi(req.params.islem_tipi);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getOzet(req, res) {
        try {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const result = await KasaHareketleri.getOzet(baslangic_tarihi, bitis_tarihi);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async onayla(req, res) {
        try {
            const result = await KasaHareketleri.updateDurum(req.params.id, 'onaylandi', req.body.aciklama);
            if (!result) {
                return res.status(404).json({ error: 'Kasa hareketi bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async reddet(req, res) {
        try {
            const result = await KasaHareketleri.updateDurum(req.params.id, 'reddedildi', req.body.aciklama);
            if (!result) {
                return res.status(404).json({ error: 'Kasa hareketi bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = KasaHareketleriController; 