const db = require('../config/db');
const BaseModel = require('./BaseModel');

class Bolge extends BaseModel {
    static tableName = 'bolgeler';

    // Tüm bölgeleri getir
    static async getAll(filters = {}) {
        const { aktif, search, limit, offset } = filters;
        
        let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
        const values = [];
        let valueIndex = 1;

        if (aktif !== undefined) {
            query += ` AND aktif = $${valueIndex}`;
            values.push(aktif);
            valueIndex++;
        }

        if (search) {
            query += ` AND (ad ILIKE $${valueIndex} OR aciklama ILIKE $${valueIndex})`;
            values.push(`%${search}%`);
            valueIndex++;
        }

        query += ' ORDER BY siralama ASC, ad ASC';

        if (limit) {
            query += ` LIMIT $${valueIndex}`;
            values.push(limit);
            valueIndex++;
        }

        if (offset) {
            query += ` OFFSET $${valueIndex}`;
            values.push(offset);
        }

        const result = await db.query(query, values);
        return result.rows;
    }

    // Belirli bir bölgeyi getir
    static async getById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new Error('Bölge bulunamadı');
        }
        
        return result.rows[0];
    }

    // Yeni bölge oluştur
    static async create(data) {
        const { ad, aciklama, aktif = true, siralama = 0 } = data;
        
        const query = `
            INSERT INTO ${this.tableName} (ad, aciklama, aktif, siralama)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const result = await db.query(query, [ad, aciklama, aktif, siralama]);
        return result.rows[0];
    }

    // Bölge güncelle
    static async update(id, data) {
        const { ad, aciklama, aktif, siralama } = data;
        
        const query = `
            UPDATE ${this.tableName}
            SET ad = $1, aciklama = $2, aktif = $3, siralama = $4
            WHERE id = $5
            RETURNING *
        `;
        
        const result = await db.query(query, [ad, aciklama, aktif, siralama, id]);
        
        if (result.rows.length === 0) {
            throw new Error('Bölge bulunamadı');
        }
        
        return result.rows[0];
    }

    // Bölge sil
    static async delete(id) {
        // Önce bölgeye ait masaları kontrol et
        const masaQuery = 'SELECT COUNT(*) FROM masalar WHERE bolge_id = $1';
        const masaResult = await db.query(masaQuery, [id]);
        
        if (masaResult.rows[0].count > 0) {
            throw new Error('Bu bölgeye ait masalar bulunmaktadır. Önce masaları silmelisiniz.');
        }
        
        const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new Error('Bölge bulunamadı');
        }
        
        return result.rows[0];
    }

    // Bölgeye ait masaları getir
    static async getMasalar(id) {
        const query = `
            SELECT m.* 
            FROM masalar m
            WHERE m.bolge_id = $1
            ORDER BY m.numara ASC
        `;
        
        const result = await db.query(query, [id]);
        return result.rows;
    }

    // Bölge durumunu güncelle
    static async updateDurum(id, aktif) {
        const query = `
            UPDATE ${this.tableName}
            SET aktif = $1
            WHERE id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [aktif, id]);
        
        if (result.rows.length === 0) {
            throw new Error('Bölge bulunamadı');
        }
        
        return result.rows[0];
    }

    // Bölge sıralamasını güncelle
    static async updateSiralama(id, siralama) {
        const query = `
            UPDATE ${this.tableName}
            SET siralama = $1
            WHERE id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [siralama, id]);
        
        if (result.rows.length === 0) {
            throw new Error('Bölge bulunamadı');
        }
        
        return result.rows[0];
    }
}

module.exports = Bolge; 