const BaseController = require('./BaseController');
const db = require('../config/db');
const { validateSchema } = require('../utils/validation');
const { cariSchema } = require('../validations/cari');

class CariController extends BaseController {
    static async getAll(req, res) {
        try {
            const { limit = 10, offset = 0, durum, tip } = req.query;

            let query = `
                SELECT 
                    c.*,
                    (
                        SELECT SUM(CASE WHEN tip = 'borc' THEN tutar ELSE -tutar END)
                        FROM cari_hareketler
                        WHERE cari_id = c.id
                    ) as bakiye
                FROM cariler c
                WHERE 1=1
            `;
            const values = [];
            let valueIndex = 1;

            if (durum) {
                query += ` AND c.durum = $${valueIndex}`;
                values.push(durum);
                valueIndex++;
            }

            if (tip) {
                query += ` AND c.tip = $${valueIndex}`;
                values.push(tip);
                valueIndex++;
            }

            query += ` ORDER BY c.ad ASC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
            values.push(limit, offset);

            const result = await db.query(query, values);

            // Toplam kayıt sayısını al
            const countQuery = `
                SELECT COUNT(*) as total
                FROM cariler c
                WHERE 1=1
                ${durum ? 'AND c.durum = $1' : ''}
                ${tip ? 'AND c.tip = $2' : ''}
            `;
            const countResult = await db.query(countQuery, values.slice(0, -2));

            return res.json(this.successResponse({
                data: result.rows,
                total: parseInt(countResult.rows[0].total),
                limit: parseInt(limit),
                offset: parseInt(offset)
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;

            const query = `
                SELECT 
                    c.*,
                    (
                        SELECT SUM(CASE WHEN tip = 'borc' THEN tutar ELSE -tutar END)
                        FROM cari_hareketler
                        WHERE cari_id = c.id
                    ) as bakiye
                FROM cariler c
                WHERE c.id = $1
            `;
            const result = await db.query(query, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            return res.json(this.successResponse(result.rows[0]));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    static async create(req, res) {
        const client = await db.pool.connect();
        try {
            const validationResult = validateSchema(cariSchema, req.body);
            if (!validationResult.isValid) {
                return res.status(400).json(this.errorResponse('Validasyon hatası', validationResult.errors));
            }

            await client.query('BEGIN');

            const {
                ad,
                tip,
                vergi_dairesi,
                vergi_no,
                telefon,
                email,
                adres,
                notlar
            } = req.body;

            const query = `
                INSERT INTO cariler (
                    ad,
                    tip,
                    vergi_dairesi,
                    vergi_no,
                    telefon,
                    email,
                    adres,
                    notlar,
                    durum
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'aktif')
                RETURNING *
            `;

            const result = await client.query(query, [
                ad,
                tip,
                vergi_dairesi,
                vergi_no,
                telefon,
                email,
                adres,
                notlar
            ]);

            await client.query('COMMIT');

            return res.status(201).json(this.successResponse(result.rows[0], 'Cari başarıyla oluşturuldu'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    static async update(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;

            const validationResult = validateSchema(cariSchema, req.body);
            if (!validationResult.isValid) {
                return res.status(400).json(this.errorResponse('Validasyon hatası', validationResult.errors));
            }

            await client.query('BEGIN');

            // Cari kontrolü
            const checkQuery = 'SELECT * FROM cariler WHERE id = $1';
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            const {
                ad,
                tip,
                vergi_dairesi,
                vergi_no,
                telefon,
                email,
                adres,
                notlar
            } = req.body;

            const query = `
                UPDATE cariler
                SET 
                    ad = $1,
                    tip = $2,
                    vergi_dairesi = $3,
                    vergi_no = $4,
                    telefon = $5,
                    email = $6,
                    adres = $7,
                    notlar = $8,
                    guncelleme_tarihi = CURRENT_TIMESTAMP
                WHERE id = $9
                RETURNING *
            `;

            const result = await client.query(query, [
                ad,
                tip,
                vergi_dairesi,
                vergi_no,
                telefon,
                email,
                adres,
                notlar,
                id
            ]);

            await client.query('COMMIT');

            return res.json(this.successResponse(result.rows[0], 'Cari başarıyla güncellendi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    static async delete(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;

            await client.query('BEGIN');

            // Cari kontrolü
            const checkQuery = 'SELECT * FROM cariler WHERE id = $1';
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            // Hareket kontrolü
            const hareketQuery = 'SELECT id FROM cari_hareketler WHERE cari_id = $1';
            const hareketResult = await client.query(hareketQuery, [id]);

            if (hareketResult.rows.length > 0) {
                return res.status(400).json(this.errorResponse('Hareketleri olan bir cari silinemez'));
            }

            const query = 'DELETE FROM cariler WHERE id = $1 RETURNING *';
            const result = await client.query(query, [id]);

            await client.query('COMMIT');

            return res.json(this.successResponse(result.rows[0], 'Cari başarıyla silindi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    static async durumGuncelle(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;
            const { durum } = req.body;

            if (!['aktif', 'pasif'].includes(durum)) {
                return res.status(400).json(this.errorResponse('Geçersiz durum değeri'));
            }

            await client.query('BEGIN');

            // Cari kontrolü
            const checkQuery = 'SELECT * FROM cariler WHERE id = $1';
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            const query = `
                UPDATE cariler
                SET 
                    durum = $1,
                    guncelleme_tarihi = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *
            `;
            const result = await client.query(query, [durum, id]);

            await client.query('COMMIT');

            return res.json(this.successResponse(result.rows[0], 'Cari durumu başarıyla güncellendi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    static async getHareketler(req, res) {
        try {
            const { cariId } = req.params;
            const { limit = 10, offset = 0, tarih_baslangic, tarih_bitis } = req.query;

            let query = `
                SELECT 
                    ch.*,
                    k.ad as kullanici_adi,
                    k.soyad as kullanici_soyadi
                FROM cari_hareketler ch
                LEFT JOIN kullanicilar k ON ch.kullanici_id = k.id
                WHERE ch.cari_id = $1
            `;
            const values = [cariId];
            let valueIndex = 2;

            if (tarih_baslangic) {
                query += ` AND ch.tarih >= $${valueIndex}`;
                values.push(tarih_baslangic);
                valueIndex++;
            }

            if (tarih_bitis) {
                query += ` AND ch.tarih <= $${valueIndex}`;
                values.push(tarih_bitis);
                valueIndex++;
            }

            query += ` ORDER BY ch.tarih DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
            values.push(limit, offset);

            const result = await db.query(query, values);

            // Toplam kayıt sayısını al
            const countQuery = `
                SELECT COUNT(*) as total
                FROM cari_hareketler
                WHERE cari_id = $1
                ${tarih_baslangic ? 'AND tarih >= $2' : ''}
                ${tarih_bitis ? 'AND tarih <= $3' : ''}
            `;
            const countResult = await db.query(countQuery, values.slice(0, -2));

            // Bakiye bilgisini al
            const bakiyeQuery = `
                SELECT SUM(CASE WHEN tip = 'borc' THEN tutar ELSE -tutar END) as bakiye
                FROM cari_hareketler
                WHERE cari_id = $1
            `;
            const bakiyeResult = await db.query(bakiyeQuery, [cariId]);

            return res.json(this.successResponse({
                data: result.rows,
                total: parseInt(countResult.rows[0].total),
                limit: parseInt(limit),
                offset: parseInt(offset),
                bakiye: parseFloat(bakiyeResult.rows[0].bakiye || 0)
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    static async hareketEkle(req, res) {
        const client = await db.pool.connect();
        try {
            const { cariId } = req.params;
            const { tip, tutar, aciklama } = req.body;

            if (!['borc', 'alacak'].includes(tip)) {
                return res.status(400).json(this.errorResponse('Geçersiz hareket tipi'));
            }

            if (!tutar || tutar <= 0) {
                return res.status(400).json(this.errorResponse('Geçersiz tutar'));
            }

            await client.query('BEGIN');

            // Cari kontrol��
            const cariQuery = 'SELECT * FROM cariler WHERE id = $1';
            const cariResult = await client.query(cariQuery, [cariId]);

            if (cariResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            const query = `
                INSERT INTO cari_hareketler (
                    cari_id,
                    kullanici_id,
                    tip,
                    tutar,
                    aciklama
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

            const result = await client.query(query, [
                cariId,
                req.user.id,
                tip,
                tutar,
                aciklama
            ]);

            // Kasa hareketi oluştur
            const kasaHareketiQuery = `
                INSERT INTO kasa_hareketleri (
                    tip,
                    tutar,
                    odeme_yontemi,
                    kasiyer_id,
                    referans_id,
                    referans_tip,
                    aciklama
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `;
            await client.query(kasaHareketiQuery, [
                tip === 'borc' ? 'cikis' : 'giris',
                tutar,
                'nakit',
                req.user.id,
                result.rows[0].id,
                'cari_hareket',
                `Cari hareket: ${cariResult.rows[0].ad} - ${aciklama || ''}`
            ]);

            await client.query('COMMIT');

            return res.status(201).json(this.successResponse(result.rows[0], 'Cari hareket başarıyla eklendi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    static async getBorcluCariler(req, res) {
        try {
            const query = `
                SELECT 
                    c.*,
                    (
                        SELECT SUM(CASE WHEN tip = 'borc' THEN tutar ELSE -tutar END)
                        FROM cari_hareketler
                        WHERE cari_id = c.id
                    ) as bakiye
                FROM cariler c
                WHERE c.durum = 'aktif'
                AND EXISTS (
                    SELECT 1
                    FROM cari_hareketler ch
                    WHERE ch.cari_id = c.id
                    GROUP BY ch.cari_id
                    HAVING SUM(CASE WHEN tip = 'borc' THEN tutar ELSE -tutar END) > 0
                )
                ORDER BY bakiye DESC
            `;
            const result = await db.query(query);

            return res.json(this.successResponse(result.rows));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    static async getAlacakliCariler(req, res) {
        try {
            const query = `
                SELECT 
                    c.*,
                    (
                        SELECT SUM(CASE WHEN tip = 'borc' THEN tutar ELSE -tutar END)
                        FROM cari_hareketler
                        WHERE cari_id = c.id
                    ) as bakiye
                FROM cariler c
                WHERE c.durum = 'aktif'
                AND EXISTS (
                    SELECT 1
                    FROM cari_hareketler ch
                    WHERE ch.cari_id = c.id
                    GROUP BY ch.cari_id
                    HAVING SUM(CASE WHEN tip = 'borc' THEN tutar ELSE -tutar END) < 0
                )
                ORDER BY bakiye ASC
            `;
            const result = await db.query(query);

            return res.json(this.successResponse(result.rows));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Cari tipine göre carileri getir
    static async getByTip(req, res) {
        try {
            const { tip } = req.params;
            const { limit = 10, offset = 0 } = req.query;

            const query = `
                SELECT 
                    c.*,
                    (
                        SELECT SUM(CASE WHEN tip = 'borc' THEN tutar ELSE -tutar END)
                        FROM cari_hareketler
                        WHERE cari_id = c.id
                    ) as bakiye
                FROM cariler c
                WHERE c.tip = $1
                ORDER BY c.ad ASC
                LIMIT $2 OFFSET $3
            `;

            const result = await db.query(query, [tip, limit, offset]);

            // Toplam kayıt sayısını al
            const countQuery = `
                SELECT COUNT(*) as total
                FROM cariler c
                WHERE c.tip = $1
            `;
            const countResult = await db.query(countQuery, [tip]);

            return res.json(this.successResponse({
                data: result.rows,
                total: parseInt(countResult.rows[0].total),
                limit: parseInt(limit),
                offset: parseInt(offset)
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Cari bakiye güncelle
    static async updateBakiye(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;
            const { bakiye, aciklama } = req.body;

            await client.query('BEGIN');

            // Cari kontrolü
            const checkQuery = 'SELECT * FROM cariler WHERE id = $1';
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            // Bakiye hareketi ekle
            const hareketQuery = `
                INSERT INTO cari_hareketler (
                    cari_id,
                    tip,
                    tutar,
                    aciklama,
                    kullanici_id
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

            const tip = bakiye > 0 ? 'borc' : 'odeme';
            const tutar = Math.abs(bakiye);

            const hareketResult = await client.query(hareketQuery, [
                id,
                tip,
                tutar,
                aciklama,
                req.user.id
            ]);

            await client.query('COMMIT');

            return res.json(this.successResponse(hareketResult.rows[0], 'Cari bakiyesi başarıyla güncellendi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    // Cari borç ekle
    static async borcEkle(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;
            const { tutar, aciklama } = req.body;

            await client.query('BEGIN');

            // Cari kontrolü
            const checkQuery = 'SELECT * FROM cariler WHERE id = $1';
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            // Borç hareketi ekle
            const hareketQuery = `
                INSERT INTO cari_hareketler (
                    cari_id,
                    tip,
                    tutar,
                    aciklama,
                    kullanici_id
                )
                VALUES ($1, 'borc', $2, $3, $4)
                RETURNING *
            `;

            const hareketResult = await client.query(hareketQuery, [
                id,
                tutar,
                aciklama,
                req.user.id
            ]);

            await client.query('COMMIT');

            return res.json(this.successResponse(hareketResult.rows[0], 'Cari borcu başarıyla eklendi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    // Cari borç öde
    static async borcOde(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;
            const { tutar, aciklama } = req.body;

            await client.query('BEGIN');

            // Cari kontrolü
            const checkQuery = 'SELECT * FROM cariler WHERE id = $1';
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            // Ödeme hareketi ekle
            const hareketQuery = `
                INSERT INTO cari_hareketler (
                    cari_id,
                    tip,
                    tutar,
                    aciklama,
                    kullanici_id
                )
                VALUES ($1, 'odeme', $2, $3, $4)
                RETURNING *
            `;

            const hareketResult = await client.query(hareketQuery, [
                id,
                tutar,
                aciklama,
                req.user.id
            ]);

            await client.query('COMMIT');

            return res.json(this.successResponse(hareketResult.rows[0], 'Cari borcu başarıyla ödendi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    // Cari adisyonları getir
    static async getAdisyonlar(req, res) {
        try {
            const { id } = req.params;
            const { limit = 10, offset = 0 } = req.query;

            const query = `
                SELECT 
                    a.*,
                    m.numara as masa_numara,
                    k.ad as kullanici_ad,
                    k.soyad as kullanici_soyad
                FROM adisyonlar a
                LEFT JOIN masalar m ON m.id = a.masa_id
                LEFT JOIN kullanicilar k ON k.id = a.kullanici_id
                WHERE a.cari_id = $1
                ORDER BY a.tarih DESC
                LIMIT $2 OFFSET $3
            `;

            const result = await db.query(query, [id, limit, offset]);

            // Toplam kayıt sayısını al
            const countQuery = `
                SELECT COUNT(*) as total
                FROM adisyonlar
                WHERE cari_id = $1
            `;
            const countResult = await db.query(countQuery, [id]);

            return res.json(this.successResponse({
                data: result.rows,
                total: parseInt(countResult.rows[0].total),
                limit: parseInt(limit),
                offset: parseInt(offset)
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Cari ödemeleri getir
    static async getOdemeler(req, res) {
        try {
            const { id } = req.params;
            const { limit = 10, offset = 0 } = req.query;

            const query = `
                SELECT 
                    o.*,
                    k.ad as kullanici_ad,
                    k.soyad as kullanici_soyad
                FROM odemeler o
                LEFT JOIN kullanicilar k ON k.id = o.kullanici_id
                WHERE o.cari_id = $1
                ORDER BY o.tarih DESC
                LIMIT $2 OFFSET $3
            `;

            const result = await db.query(query, [id, limit, offset]);

            // Toplam kayıt sayısını al
            const countQuery = `
                SELECT COUNT(*) as total
                FROM odemeler
                WHERE cari_id = $1
            `;
            const countResult = await db.query(countQuery, [id]);

            return res.json(this.successResponse({
                data: result.rows,
                total: parseInt(countResult.rows[0].total),
                limit: parseInt(limit),
                offset: parseInt(offset)
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Cari borç durumu getir
    static async getBorcDurum(req, res) {
        try {
            const { id } = req.params;

            const query = `
                SELECT 
                    c.id,
                    c.ad,
                    c.tip,
                    c.limit,
                    (
                        SELECT SUM(CASE WHEN tip = 'borc' THEN tutar ELSE -tutar END)
                        FROM cari_hareketler
                        WHERE cari_id = c.id
                    ) as bakiye,
                    (
                        SELECT COUNT(*)
                        FROM cari_hareketler
                        WHERE cari_id = c.id AND tip = 'borc'
                    ) as borc_sayisi,
                    (
                        SELECT COUNT(*)
                        FROM cari_hareketler
                        WHERE cari_id = c.id AND tip = 'odeme'
                    ) as odeme_sayisi,
                    (
                        SELECT MAX(tarih)
                        FROM cari_hareketler
                        WHERE cari_id = c.id AND tip = 'odeme'
                    ) as son_odeme_tarihi
                FROM cariler c
                WHERE c.id = $1
            `;

            const result = await db.query(query, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            return res.json(this.successResponse(result.rows[0]));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Cari limit güncelle
    static async updateLimit(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;
            const { limit } = req.body;

            await client.query('BEGIN');

            // Cari kontrolü
            const checkQuery = 'SELECT * FROM cariler WHERE id = $1';
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            // Limit güncelle
            const query = `
                UPDATE cariler
                SET 
                    limit = $1,
                    guncelleme_tarihi = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *
            `;

            const result = await client.query(query, [limit, id]);

            await client.query('COMMIT');

            return res.json(this.successResponse(result.rows[0], 'Cari limiti başarıyla güncellendi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }
}

module.exports = CariController; 