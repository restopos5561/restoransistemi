const BaseModel = require('./BaseModel');
const db = require('../config/db');

class Kullanici extends BaseModel {
    static tableName = 'kullanicilar';

    static async getAll() {
        try {
            const query = `
                SELECT 
                    id, ad, soyad, email, rol, aktif,
                    olusturma_tarihi, guncelleme_tarihi
                FROM ${this.tableName}
                ORDER BY ad ASC, soyad ASC
            `;

            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const query = `
                SELECT 
                    id, ad, soyad, email, rol, aktif,
                    olusturma_tarihi, guncelleme_tarihi
                FROM ${this.tableName}
                WHERE id = $1
            `;

            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByEmail(email) {
        try {
            const query = `
                SELECT *
                FROM ${this.tableName}
                WHERE email = $1
            `;

            const result = await db.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(data) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Email adresinin benzersiz olduğunu kontrol et
            const checkQuery = `
                SELECT id FROM ${this.tableName}
                WHERE LOWER(email) = LOWER($1)
            `;
            const checkResult = await client.query(checkQuery, [data.email]);
            
            if (checkResult.rows.length > 0) {
                throw new Error('Bu email adresi zaten kullanılıyor');
            }

            // Yeni kullanıcı oluştur
            const insertQuery = `
                INSERT INTO ${this.tableName} (
                    ad, soyad, email, sifre, rol, aktif
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;

            const result = await client.query(insertQuery, [
                data.ad,
                data.soyad,
                data.email,
                data.sifre,
                data.rol,
                data.aktif || 'aktif'
            ]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async update(id, data) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Email adresinin benzersiz olduğunu kontrol et
            if (data.email) {
                const checkQuery = `
                    SELECT id FROM ${this.tableName}
                    WHERE LOWER(email) = LOWER($1) AND id != $2
                `;
                const checkResult = await client.query(checkQuery, [data.email, id]);
                
                if (checkResult.rows.length > 0) {
                    throw new Error('Bu email adresi zaten kullanılıyor');
                }
            }

            // Kullanıcıyı güncelle
            const updateQuery = `
                UPDATE ${this.tableName}
                SET 
                    ad = COALESCE($1, ad),
                    soyad = COALESCE($2, soyad),
                    email = COALESCE($3, email),
                    sifre = COALESCE($4, sifre),
                    rol = COALESCE($5, rol),
                    aktif = COALESCE($6, aktif)
                WHERE id = $7
                RETURNING *
            `;

            const result = await client.query(updateQuery, [
                data.ad,
                data.soyad,
                data.email,
                data.sifre,
                data.rol,
                data.aktif,
                id
            ]);

            if (result.rows.length === 0) {
                throw new Error('Kullanıcı bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async delete(id) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Kullanıcıyı sil
            const deleteQuery = `
                DELETE FROM ${this.tableName}
                WHERE id = $1
                RETURNING *
            `;

            const result = await client.query(deleteQuery, [id]);

            if (result.rows.length === 0) {
                throw new Error('Kullanıcı bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = Kullanici; 