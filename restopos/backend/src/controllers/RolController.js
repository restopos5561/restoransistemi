const BaseController = require('./BaseController');
const Rol = require('../models/Rol');

class RolController extends BaseController {
    // Tüm rolleri getir
    static async getAll(req, res) {
        return this.handleList(req, res, Rol);
    }

    // Belirli bir rolü getir
    static async getById(req, res) {
        return this.handleGet(req, res, Rol);
    }

    // Yeni rol oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Rol.create(req.body);
            return this.success(data, 'Rol başarıyla oluşturuldu', 201);
        });
    }

    // Rol güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Rol.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Rol başarıyla güncellendi');
        });
    }

    // Rol sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Rol);
    }

    // Role yetki ata
    static async addYetki(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { yetki_id } = req.body;

            const data = await Rol.addYetki(id, yetki_id);
            return this.success(data, 'Yetki başarıyla role eklendi');
        });
    }

    // Rolden yetki kaldır
    static async removeYetki(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id, yetki_id } = req.params;

            const data = await Rol.removeYetki(id, yetki_id);
            return this.success(data, 'Yetki başarıyla rolden kaldırıldı');
        });
    }

    // Rolün yetkilerini getir
    static async getYetkiler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Rol.getYetkiler(id);
            return this.success(data);
        });
    }

    // Rol durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await Rol.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Rol durumu başarıyla güncellendi');
        });
    }
}

module.exports = RolController; 