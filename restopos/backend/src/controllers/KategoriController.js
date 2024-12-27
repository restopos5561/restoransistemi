const Kategori = require('../models/Kategori');

class KategoriController {
    static async getAll(req, res) {
        try {
            const result = await Kategori.getAll();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const result = await Kategori.getById(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Kategori bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUrunler(req, res) {
        try {
            const result = await Kategori.getUrunler(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const result = await Kategori.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            if (error.message === 'Bu isimde bir kategori zaten mevcut') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const result = await Kategori.update(req.params.id, req.body);
            if (!result) {
                return res.status(404).json({ error: 'Kategori bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            if (error.message === 'Bu isimde bir kategori zaten mevcut') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const result = await Kategori.delete(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Kategori bulunamadı' });
            }
            res.json({ message: 'Kategori başarıyla silindi' });
        } catch (error) {
            if (error.message.includes('bağlı ürünler var')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = KategoriController; 