const Kurye = require('../models/Kurye');

class KuryeController {
    static async getAll(req, res) {
        try {
            const result = await Kurye.getAll();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const result = await Kurye.getById(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Kurye bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const result = await Kurye.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            if (error.message === 'Bu telefon numarası zaten kullanılıyor') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const result = await Kurye.update(req.params.id, req.body);
            if (!result) {
                return res.status(404).json({ error: 'Kurye bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            if (error.message === 'Bu telefon numarası zaten kullanılıyor') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const result = await Kurye.delete(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Kurye bulunamadı' });
            }
            res.json({ message: 'Kurye başarıyla silindi' });
        } catch (error) {
            if (error.message.includes('aktif siparişleri var')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async getSiparisler(req, res) {
        try {
            const result = await Kurye.getSiparisler(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateDurum(req, res) {
        try {
            const result = await Kurye.updateDurum(req.params.id, req.body.durum);
            if (!result) {
                return res.status(404).json({ error: 'Kurye bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = KuryeController; 