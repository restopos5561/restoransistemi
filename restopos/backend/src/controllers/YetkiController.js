const BaseController = require('./BaseController');
const Yetki = require('../models/Yetki');
const RolYetki = require('../models/RolYetki');

class YetkiController extends BaseController {
    // Yetki listesi
    static async getYetkiler(req, res) {
        try {
            const { modul, rol_id } = req.query;
            const yetkiler = await Yetki.getAll({ modul, rol_id });
            return res.json(this.success(yetkiler));
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Yetki detayı
    static async getYetkiDetay(req, res) {
        try {
            const { id } = req.params;
            const yetki = await Yetki.getById(id);
            if (!yetki) {
                return res.status(404).json(this.notFound('Yetki bulunamadı'));
            }
            return res.json(this.success(yetki));
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Yetki oluştur
    static async createYetki(req, res) {
        try {
            const { kod, ad, aciklama, modul, islemler } = req.body;

            // Kod kontrolü
            const mevcutYetki = await Yetki.getByKod(kod);
            if (mevcutYetki) {
                return res.status(400).json(
                    this.error('Bu yetki kodu zaten kullanılıyor')
                );
            }

            const yetki = await Yetki.create({
                kod,
                ad,
                aciklama,
                modul,
                islemler
            });

            return res.status(201).json(
                this.success(yetki, 'Yetki başarıyla oluşturuldu')
            );
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Yetki güncelle
    static async updateYetki(req, res) {
        try {
            const { id } = req.params;
            const { kod, ad, aciklama, modul, islemler } = req.body;

            // Yetki kontrolü
            const mevcutYetki = await Yetki.getById(id);
            if (!mevcutYetki) {
                return res.status(404).json(this.notFound('Yetki bulunamadı'));
            }

            // Kod değişmişse kontrol et
            if (kod && kod !== mevcutYetki.kod) {
                const kodKontrol = await Yetki.getByKod(kod);
                if (kodKontrol) {
                    return res.status(400).json(
                        this.error('Bu yetki kodu zaten kullanılıyor')
                    );
                }
            }

            const yetki = await Yetki.update(id, {
                kod,
                ad,
                aciklama,
                modul,
                islemler
            });

            return res.json(
                this.success(yetki, 'Yetki başarıyla güncellendi')
            );
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Yetki sil
    static async deleteYetki(req, res) {
        try {
            const { id } = req.params;

            // Yetki kontrolü
            const yetki = await Yetki.getById(id);
            if (!yetki) {
                return res.status(404).json(this.notFound('Yetki bulunamadı'));
            }

            await Yetki.delete(id);
            return res.json(
                this.success(null, 'Yetki başarıyla silindi')
            );
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Rol yetki ata
    static async assignRolYetki(req, res) {
        try {
            const { rol_id, yetki_id } = req.body;

            // Yetki kontrolü
            const yetki = await Yetki.getById(yetki_id);
            if (!yetki) {
                return res.status(404).json(this.notFound('Yetki bulunamadı'));
            }

            // Rol yetki kontrolü
            const mevcutRolYetki = await RolYetki.getByRolAndYetki(rol_id, yetki_id);
            if (mevcutRolYetki) {
                return res.status(400).json(
                    this.error('Bu yetki zaten role atanmış')
                );
            }

            const rolYetki = await RolYetki.create({ rol_id, yetki_id });
            return res.status(201).json(
                this.success(rolYetki, 'Yetki role başarıyla atandı')
            );
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Rol yetki kaldır
    static async removeRolYetki(req, res) {
        try {
            const { rol_id, yetki_id } = req.body;

            // Rol yetki kontrolü
            const rolYetki = await RolYetki.getByRolAndYetki(rol_id, yetki_id);
            if (!rolYetki) {
                return res.status(404).json(this.notFound('Rol yetkisi bulunamadı'));
            }

            await RolYetki.delete(rolYetki.id);
            return res.json(
                this.success(null, 'Yetki rolden başarıyla kaldırıldı')
            );
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Rol yetkileri
    static async getRolYetkiler(req, res) {
        try {
            const { rol_id } = req.params;
            const yetkiler = await Yetki.getByRol(rol_id);
            return res.json(this.success(yetkiler));
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }

    // Modül yetkileri
    static async getModulYetkiler(req, res) {
        try {
            const { modul } = req.params;
            const yetkiler = await Yetki.getByModul(modul);
            return res.json(this.success(yetkiler));
        } catch (error) {
            return res.status(500).json(this.error(error.message));
        }
    }
}

module.exports = YetkiController; 