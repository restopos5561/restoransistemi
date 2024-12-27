const db = require('../config/db');
const BaseModel = require('./BaseModel');

class rezervasyon extends BaseModel {
    static tableName = 'rezervasyonlar';

    // Tüm rezervasyonları getir
    static async getAll(filters = {}) {
        const { aktif, tarih, masa_id, musteri_id, limit, offset } = filters;
        
        let query = `
            SELECT r.*, m.numara as masa_numara, c.ad as musteri_ad, c.soyad as musteri_soyad
            FROM ${this.tableName} r
            LEFT JOIN masalar m ON r.masa_id = m.id
            LEFT JOIN cariler c ON r.musteri_id = c.id
            WHERE 1=1
        `;
        
        const values = [];
        let valueIndex = 1;

        if (aktif) {
            query += ` AND r.aktif = $${valueIndex}`;
            values.push(aktif);
            valueIndex++;
        }

        if (tarih) {
            query += ` AND DATE(r.tarih) = $${valueIndex}`;
            values.push(tarih);
            valueIndex++;
        }

        if (masa_id) {
            query += ` AND r.masa_id = $${valueIndex}`;
            values.push(masa_id);
            valueIndex++;
        }

        if (musteri_id) {
            query += ` AND r.musteri_id = $${valueIndex}`;
            values.push(musteri_id);
            valueIndex++;
        }

        query += ' ORDER BY r.tarih DESC';

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

    // Belirli bir rezervasyonu getir
    static async getById(id) {
        const query = `
            SELECT r.*, m.numara as masa_numara, c.ad as musteri_ad, c.soyad as musteri_soyad
            FROM ${this.tableName} r
            LEFT JOIN masalar m ON r.masa_id = m.id
            LEFT JOIN cariler c ON r.musteri_id = c.id
            WHERE r.id = $1
        `;
        
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new Error('rezervasyon bulunamadı');
        }
        
        return result.rows[0];
    }

    // Yeni rezervasyon oluştur
    static async create(data) {
        const { 
            masa_id, 
            musteri_id, 
            tarih, 
            kisi_sayisi, 
            notlar, 
            aktif = 'beklemede' 
        } = data;

        // masa müsaitlik kontrolü
        await this.checkMasaMusaitlik(masa_id, tarih);
        
        const query = `
            INSERT INTO ${this.tableName} 
            (masa_id, musteri_id, tarih, kisi_sayisi, notlar, aktif)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const result = await db.query(query, [
            masa_id, 
            musteri_id, 
            tarih, 
            kisi_sayisi, 
            notlar, 
            aktif
        ]);
        
        return result.rows[0];
    }

    // rezervasyon güncelle
    static async update(id, data) {
        const { 
            masa_id, 
            musteri_id, 
            tarih, 
            kisi_sayisi, 
            notlar, 
            aktif 
        } = data;

        // Eğer masa veya tarih değişiyorsa müsaitlik kontrolü yap
        const mevcut = await this.getById(id);
        if (masa_id !== mevcut.masa_id || tarih !== mevcut.tarih) {
            await this.checkMasaMusaitlik(masa_id, tarih, id);
        }
        
        const query = `
            UPDATE ${this.tableName}
            SET masa_id = $1, musteri_id = $2, tarih = $3, 
                kisi_sayisi = $4, notlar = $5, aktif = $6
            WHERE id = $7
            RETURNING *
        `;
        
        const result = await db.query(query, [
            masa_id, 
            musteri_id, 
            tarih, 
            kisi_sayisi, 
            notlar, 
            aktif,
            id
        ]);
        
        if (result.rows.length === 0) {
            throw new Error('rezervasyon bulunamadı');
        }
        
        return result.rows[0];
    }

    // rezervasyon sil
    static async delete(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new Error('rezervasyon bulunamadı');
        }
        
        return result.rows[0];
    }

    // rezervasyon durumunu güncelle
    static async updateDurum(id, aktif) {
        const query = `
            UPDATE ${this.tableName}
            SET aktif = $1
            WHERE id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [aktif, id]);
        
        if (result.rows.length === 0) {
            throw new Error('rezervasyon bulunamadı');
        }
        
        return result.rows[0];
    }

    // masa müsaitlik kontrolü
    static async checkMasaMusaitlik(masa_id, tarih, hariç_tutulan_id = null) {
        const query = `
            SELECT COUNT(*) 
            FROM ${this.tableName}
            WHERE masa_id = $1 
            AND DATE(tarih) = DATE($2)
            AND aktif = 'onaylandi'
            ${hariç_tutulan_id ? 'AND id != $3' : ''}
        `;
        
        const values = [masa_id, tarih];
        if (hariç_tutulan_id) values.push(hariç_tutulan_id);
        
        const result = await db.query(query, values);
        
        if (result.rows[0].count > 0) {
            throw new Error('Seçilen masa ve tarih için başka bir rezervasyon bulunmaktadır');
        }
    }

    // Tarih aralığına göre rezervasyonları getir
    static async getByTarihAraligi(baslangic, bitis) {
        const query = `
            SELECT r.*, m.numara as masa_numara, c.ad as musteri_ad, c.soyad as musteri_soyad
            FROM ${this.tableName} r
            LEFT JOIN masalar m ON r.masa_id = m.id
            LEFT JOIN cariler c ON r.musteri_id = c.id
            WHERE DATE(r.tarih) BETWEEN DATE($1) AND DATE($2)
            ORDER BY r.tarih ASC
        `;
        
        const result = await db.query(query, [baslangic, bitis]);
        return result.rows;
    }

    // Müşteriye göre rezervasyonları getir
    static async getByMusteri(musteri_id) {
        const query = `
            SELECT r.*, m.numara as masa_numara
            FROM ${this.tableName} r
            LEFT JOIN masalar m ON r.masa_id = m.id
            WHERE r.musteri_id = $1
            ORDER BY r.tarih DESC
        `;
        
        const result = await db.query(query, [musteri_id]);
        return result.rows;
    }

    // Masaya göre rezervasyonları getir
    static async getByMasa(masa_id) {
        const query = `
            SELECT r.*, c.ad as musteri_ad, c.soyad as musteri_soyad
            FROM ${this.tableName} r
            LEFT JOIN cariler c ON r.musteri_id = c.id
            WHERE r.masa_id = $1
            ORDER BY r.tarih DESC
        `;
        
        const result = await db.query(query, [masa_id]);
        return result.rows;
    }
}

module.exports = rezervasyon; 