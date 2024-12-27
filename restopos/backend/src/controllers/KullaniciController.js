const Kullanici = require('../models/Kullanici');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class KullaniciController {
    static async getAll(req, res) {
        try {
            const result = await Kullanici.getAll();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const result = await Kullanici.getById(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            // Şifreyi hashle
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.sifre, salt);

            const result = await Kullanici.create({
                ...req.body,
                sifre: hashedPassword
            });

            // Şifreyi response'dan çıkar
            const { sifre, ...kullaniciData } = result;
            res.status(201).json(kullaniciData);
        } catch (error) {
            if (error.message === 'Bu email adresi zaten kullanılıyor') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            let updateData = { ...req.body };

            // Eğer şifre güncelleniyorsa hashle
            if (updateData.sifre) {
                const salt = await bcrypt.genSalt(10);
                updateData.sifre = await bcrypt.hash(updateData.sifre, salt);
            }

            const result = await Kullanici.update(req.params.id, updateData);
            if (!result) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }

            // Şifreyi response'dan çıkar
            const { sifre, ...kullaniciData } = result;
            res.json(kullaniciData);
        } catch (error) {
            if (error.message === 'Bu email adresi zaten kullanılıyor') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const result = await Kullanici.delete(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }
            res.json({ message: 'Kullanıcı başarıyla silindi' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, sifre } = req.body;

            // Kullanıcıyı bul
            const kullanici = await Kullanici.getByEmail(email);
            if (!kullanici) {
                return res.status(401).json({ error: 'Email veya şifre hatalı' });
            }

            // Şifreyi kontrol et
            const validPassword = await bcrypt.compare(sifre, kullanici.sifre);
            if (!validPassword) {
                return res.status(401).json({ error: 'Email veya şifre hatalı' });
            }

            // Kullanıcı pasifse giriş yapamaz
            if (kullanici.durum === 'pasif') {
                return res.status(403).json({ error: 'Hesabınız pasif durumda' });
            }

            // JWT token oluştur
            const token = jwt.sign(
                { 
                    id: kullanici.id,
                    email: kullanici.email,
                    rol: kullanici.rol
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Şifreyi response'dan çıkar
            const { sifre: _, ...kullaniciData } = kullanici;

            res.json({
                ...kullaniciData,
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async changePassword(req, res) {
        try {
            const { eski_sifre, yeni_sifre } = req.body;
            const kullanici_id = req.user.id;

            // Kullanıcıyı bul
            const kullanici = await Kullanici.getById(kullanici_id);
            if (!kullanici) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }

            // Eski şifreyi kontrol et
            const validPassword = await bcrypt.compare(eski_sifre, kullanici.sifre);
            if (!validPassword) {
                return res.status(400).json({ error: 'Eski şifre hatalı' });
            }

            // Yeni şifreyi hashle
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(yeni_sifre, salt);

            // Şifreyi güncelle
            await Kullanici.update(kullanici_id, { sifre: hashedPassword });

            res.json({ message: 'Şifre başarıyla değiştirildi' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = KullaniciController; 