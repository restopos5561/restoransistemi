const db = require('../config/db');

class Yetki {
    static async getAll() {
        try {
            const query = `
                SELECT 
                    y.*,
                    COUNT(ry.rol_id) as rol_sayisi
                FROM yetkiler y
                LEFT JOIN rol_yetkiler ry ON y.id = ry.yetki_id
                GROUP BY y.id
                ORDER BY y.kod
            `;
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Yetkiler getirilirken hata oluştu: ${error.message}`);
        }
    }

    static async getById(id) {
        try {
            const query = `
                SELECT * FROM yetkiler WHERE id = $1
            `;
            const result = await db.query(query, [id]);
            
            if (result.rows.length === 0) {
                throw new Error('Yetki bulunamadı');
            }

            return result.rows[0];
        } catch (error) {
            throw new Error(`Yetki getirilirken hata oluştu: ${error.message}`);
        }
    }

    static async create(yetkiData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const { kod, aciklama } = yetkiData;

            // Kod kontrolü
            const kodKontrol = await client.query(
                'SELECT id FROM yetkiler WHERE kod = $1',
                [kod]
            );

            if (kodKontrol.rows.length > 0) {
                throw new Error('Bu yetki kodu zaten kullanılıyor');
            }

            const query = `
                INSERT INTO yetkiler (kod, aciklama)
                VALUES ($1, $2)
                RETURNING *
            `;

            const result = await client.query(query, [kod, aciklama]);
            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Yetki oluşturulurken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    static async update(id, yetkiData) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const { kod, aciklama } = yetkiData;

            // Kod kontrolü
            if (kod) {
                const kodKontrol = await client.query(
                    'SELECT id FROM yetkiler WHERE kod = $1 AND id != $2',
                    [kod, id]
                );

                if (kodKontrol.rows.length > 0) {
                    throw new Error('Bu yetki kodu zaten kullanılıyor');
                }
            }

            const query = `
                UPDATE yetkiler
                SET 
                    kod = COALESCE($1, kod),
                    aciklama = COALESCE($2, aciklama),
                    guncelleme_tarihi = NOW()
                WHERE id = $3
                RETURNING *
            `;

            const result = await client.query(query, [kod, aciklama, id]);

            if (result.rows.length === 0) {
                throw new Error('Yetki bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Yetki güncellenirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }

    static async delete(id) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Yetki-rol ilişkilerini kontrol et
            const iliskiKontrol = await client.query(
                'SELECT COUNT(*) as sayi FROM rol_yetkiler WHERE yetki_id = $1',
                [id]
            );

            if (iliskiKontrol.rows[0].sayi > 0) {
                throw new Error('Bu yetki bir veya birden fazla role atanmış durumda');
            }

            const result = await client.query(
                'DELETE FROM yetkiler WHERE id = $1 RETURNING *',
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('Yetki bulunamadı');
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Yetki silinirken hata oluştu: ${error.message}`);
        } finally {
            client.release();
        }
    }
}

module.exports = Yetki; 