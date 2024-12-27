const db = require('../config/db');

class Rol {
    // Tüm rolleri getir
    static async getAll() {
        try {
            const query = `
                SELECT 
                    r.*,
                    COUNT(k.id) as kullanici_sayisi
                FROM roller r
                LEFT JOIN kullanicilar k ON r.id = k.rol_id
                GROUP BY r.id
                ORDER BY r.ad
            `;
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Roller getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Belirli bir rolü getir
    static async getById(id) {
        try {
            const query = `
                SELECT 
                    r.*,
                    COUNT(k.id) as kullanici_sayisi
                FROM roller r
                LEFT JOIN kullanicilar k ON r.id = k.rol_id
                WHERE r.id = $1
                GROUP BY r.id
            `;
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                throw new Error('Rol bulunamadı');
            }

            return result.rows[0];
        } catch (error) {
            throw new Error(`Rol getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Ada göre rol getir
    static async getByAd(ad) {
        try {
            const query = `
                SELECT 
                    r.*,
                    COUNT(k.id) as kullanici_sayisi
                FROM roller r
                LEFT JOIN kullanicilar k ON r.id = k.rol_id
                WHERE r.ad = $1
                GROUP BY r.id
            `;
            const result = await db.query(query, [ad]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Rol getirilirken hata oluştu: ${error.message}`);
        }
    }

    // Yeni rol oluştur
    static async create(rolData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const { ad, aciklama } = rolData;

            // Ad kontrolü
            const adKontrol = await client.query(
                'SELECT id FROM roller WHERE ad = $1',
                [ad]
            );

            if (adKontrol.rows.length > 0) {
                throw new Error('Bu rol adı zaten kullanılıyor');
            }

            const query = `
                INSERT INTO roller (ad, aciklama)
                VALUES ($1, $2)
                RETURNING id
            `;

            const result = await client.query(query, [ad, aciklama]);

            await client.query('COMMIT');
            return await this.getById(result.rows[0].id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Rol oluşturulurken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Rolü güncelle
    static async update(id, rolData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const { ad, aciklama } = rolData;

            // Ad kontrolü
            if (ad) {
                const adKontrol = await client.query(
                    'SELECT id FROM roller WHERE ad = $1 AND id != $2',
                    [ad, id]
                );

                if (adKontrol.rows.length > 0) {
                    throw new Error('Bu rol adı zaten kullanılıyor');
                }
            }

            let updateFields = [];
            let values = [];
            let valueIndex = 1;

            if (ad) {
                updateFields.push(`ad = $${valueIndex}`);
                values.push(ad);
                valueIndex++;
            }

            if (aciklama !== undefined) {
                updateFields.push(`aciklama = $${valueIndex}`);
                values.push(aciklama);
                valueIndex++;
            }

            if (updateFields.length === 0) {
                throw new Error('Güncellenecek alan bulunamadı');
            }

            const query = `
                UPDATE roller
                SET ${updateFields.join(', ')}
                WHERE id = $${valueIndex}
                RETURNING id
            `;

            values.push(id);
            const result = await client.query(query, values);

            if (result.rows.length === 0) {
                throw new Error('Rol bulunamadı');
            }

            await client.query('COMMIT');
            return await this.getById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Rol güncellenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    // Rolü sil
    static async delete(id) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Rolün kullanıcılarını kontrol et
            const kullaniciKontrol = await client.query(
                'SELECT COUNT(*) as kullanici_sayisi FROM kullanicilar WHERE rol_id = $1',
                [id]
            );

            if (kullaniciKontrol.rows[0].kullanici_sayisi > 0) {
                throw new Error('Bu rol silinemez çünkü kullanıcıları var');
            }

            const result = await client.query(
                'DELETE FROM roller WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('Rol bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Rol silinirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }
}

module.exports = Rol; 