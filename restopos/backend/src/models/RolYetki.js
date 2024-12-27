const BaseModel = require('./BaseModel');
const db = require('../config/db');

class RolYetki extends BaseModel {
    static tableName = 'rol_yetkiler';

    // Rol ve yetkiye göre kayıt getir
    static async getByRolAndYetki(rol_id, yetki_id) {
        try {
            const result = await db(this.tableName)
                .where({ rol_id, yetki_id })
                .first();
            return result;
        } catch (error) {
            throw new Error(`RolYetki.getByRolAndYetki: ${error.message}`);
        }
    }

    // Yeni rol-yetki ilişkisi oluştur
    static async create({ rol_id, yetki_id }) {
        try {
            const [id] = await db(this.tableName)
                .insert({
                    rol_id,
                    yetki_id,
                    olusturma_tarihi: new Date()
                })
                .returning('id');

            return this.getById(id);
        } catch (error) {
            throw new Error(`RolYetki.create: ${error.message}`);
        }
    }

    // Role göre yetkileri getir
    static async getByRol(rol_id) {
        try {
            const result = await db(this.tableName)
                .select('yetki_id')
                .where({ rol_id });
            return result.map(r => r.yetki_id);
        } catch (error) {
            throw new Error(`RolYetki.getByRol: ${error.message}`);
        }
    }

    // Yetkiye göre rolleri getir
    static async getByYetki(yetki_id) {
        try {
            const result = await db(this.tableName)
                .select('rol_id')
                .where({ yetki_id });
            return result.map(r => r.rol_id);
        } catch (error) {
            throw new Error(`RolYetki.getByYetki: ${error.message}`);
        }
    }

    // Rol-yetki ilişkisini sil
    static async delete(id) {
        try {
            await db(this.tableName)
                .where({ id })
                .delete();
            return true;
        } catch (error) {
            throw new Error(`RolYetki.delete: ${error.message}`);
        }
    }

    // Rol için yetkileri toplu güncelle
    static async updateRolYetkiler(rol_id, yetki_listesi) {
        try {
            // Önce mevcut yetkileri sil
            await db(this.tableName)
                .where({ rol_id })
                .delete();

            // Yeni yetkileri ekle
            if (yetki_listesi && yetki_listesi.length > 0) {
                const yetkiler = yetki_listesi.map(yetki_id => ({
                    rol_id,
                    yetki_id,
                    olusturma_tarihi: new Date()
                }));

                await db(this.tableName).insert(yetkiler);
            }

            return this.getByRol(rol_id);
        } catch (error) {
            throw new Error(`RolYetki.updateRolYetkiler: ${error.message}`);
        }
    }

    // Yetki için rolleri toplu güncelle
    static async updateYetkiRoller(yetki_id, rol_listesi) {
        try {
            // Önce mevcut rolleri sil
            await db(this.tableName)
                .where({ yetki_id })
                .delete();

            // Yeni rolleri ekle
            if (rol_listesi && rol_listesi.length > 0) {
                const roller = rol_listesi.map(rol_id => ({
                    rol_id,
                    yetki_id,
                    olusturma_tarihi: new Date()
                }));

                await db(this.tableName).insert(roller);
            }

            return this.getByYetki(yetki_id);
        } catch (error) {
            throw new Error(`RolYetki.updateYetkiRoller: ${error.message}`);
        }
    }
}

module.exports = RolYetki; 