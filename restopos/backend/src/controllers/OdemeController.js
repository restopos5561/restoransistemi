const BaseController = require('./BaseController');
const db = require('../config/db');
const { validateSchema } = require('../utils/validation');
const { odemeSchema } = require('../validations/odeme');

class OdemeController extends BaseController {
    // Tüm ödemeleri getir
    static async getAll(req, res) {
        try {
            const { limit = 10, offset = 0, adisyon_id, tarih_baslangic, tarih_bitis } = req.query;

            let query = `
                SELECT 
                    o.*,
                    k.ad as kasiyer_adi,
                    k.soyad as kasiyer_soyadi,
                    a.masa_id,
                    m.ad as masa_adi,
                    c.unvan as cari_unvan
                FROM odemeler o
                LEFT JOIN kullanicilar k ON o.kasiyer_id = k.id
                LEFT JOIN adisyonlar a ON o.adisyon_id = a.id
                LEFT JOIN masalar m ON a.masa_id = m.id
                LEFT JOIN cariler c ON o.cari_id = c.id
                WHERE 1=1
            `;
            const values = [];
            let valueIndex = 1;

            if (adisyon_id) {
                query += ` AND o.adisyon_id = $${valueIndex}`;
                values.push(adisyon_id);
                valueIndex++;
            }

            if (tarih_baslangic) {
                query += ` AND o.tarih >= $${valueIndex}`;
                values.push(tarih_baslangic);
                valueIndex++;
            }

            if (tarih_bitis) {
                query += ` AND o.tarih <= $${valueIndex}`;
                values.push(tarih_bitis);
                valueIndex++;
            }

            query += ` ORDER BY o.tarih DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
            values.push(limit, offset);

            const result = await db.query(query, values);

            // Toplam kayıt sayısını al
            const countQuery = `
                SELECT COUNT(*) as total
                FROM odemeler o
                WHERE 1=1
                ${adisyon_id ? ' AND o.adisyon_id = $1' : ''}
                ${tarih_baslangic ? ' AND o.tarih >= $2' : ''}
                ${tarih_bitis ? ' AND o.tarih <= $3' : ''}
            `;
            const countValues = [];
            if (adisyon_id) countValues.push(adisyon_id);
            if (tarih_baslangic) countValues.push(tarih_baslangic);
            if (tarih_bitis) countValues.push(tarih_bitis);

            const countResult = await db.query(countQuery, countValues);

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

    // Yeni ödeme oluştur
    static async create(req, res) {
        const client = await db.pool.connect();
        try {
            const { adisyon_id, tutar, odeme_yontemi, aciklama, cari_id } = req.body;

            await client.query('BEGIN');

            // Adisyon kontrolü
            const adisyonQuery = `
                SELECT *
                FROM adisyonlar
                WHERE id = $1
            `;
            const adisyonResult = await client.query(adisyonQuery, [adisyon_id]);

            if (adisyonResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Adisyon bulunamadı'));
            }

            const adisyon = adisyonResult.rows[0];

            if (adisyon.durum === 'kapali') {
                return res.status(400).json(this.errorResponse('Kapalı adisyona ödeme eklenemez'));
            }

            // Toplam ödemeleri kontrol et
            const odemelerQuery = `
                SELECT SUM(tutar) as toplam_odeme 
                FROM odemeler 
                WHERE adisyon_id = $1
            `;
            const odemelerResult = await client.query(odemelerQuery, [adisyon_id]);
            const toplamOdeme = parseFloat(odemelerResult.rows[0].toplam_odeme || 0);
            const yeniToplam = toplamOdeme + parseFloat(tutar);

            if (yeniToplam > adisyon.toplam_tutar) {
                return res.status(400).json(this.errorResponse('Ödeme tutarı adisyon tutarını aşamaz'));
            }

            // Ödemeyi oluştur
            const insertQuery = `
                INSERT INTO odemeler (
                    adisyon_id,
                    tutar,
                    odeme_yontemi,
                    aciklama,
                    cari_id,
                    kasiyer_id
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;

            const result = await client.query(insertQuery, [
                adisyon_id,
                tutar,
                odeme_yontemi,
                aciklama,
                cari_id,
                req.user.id
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
                'giris',
                tutar,
                odeme_yontemi,
                req.user.id,
                result.rows[0].id,
                'odeme',
                `Yeni ödeme: ${aciklama || ''}`
            ]);

            await client.query('COMMIT');

            return res.json(this.successResponse(result.rows[0], 'Ödeme başarıyla oluşturuldu'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    // Belirli bir ödemeyi getir
    static async getById(req, res) {
        try {
            const { id } = req.params;

            const query = `
                SELECT 
                    o.*,
                    k.ad as kasiyer_adi,
                    k.soyad as kasiyer_soyadi,
                    a.masa_id,
                    m.ad as masa_adi,
                    c.unvan as cari_unvan
                FROM odemeler o
                LEFT JOIN kullanicilar k ON o.kasiyer_id = k.id
                LEFT JOIN adisyonlar a ON o.adisyon_id = a.id
                LEFT JOIN masalar m ON a.masa_id = m.id
                LEFT JOIN cariler c ON o.cari_id = c.id
                WHERE o.id = $1
            `;

            const result = await db.query(query, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Ödeme bulunamadı'));
            }

            return res.json(this.successResponse(result.rows[0]));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Adisyona göre ödemeleri getir
    static async getByAdisyon(req, res) {
        try {
            const { adisyonId } = req.params;

            const query = `
                SELECT 
                    o.*,
                    k.ad as kasiyer_adi,
                    k.soyad as kasiyer_soyadi,
                    c.unvan as cari_unvan
                FROM odemeler o
                LEFT JOIN kullanicilar k ON o.kasiyer_id = k.id
                LEFT JOIN cariler c ON o.cari_id = c.id
                WHERE o.adisyon_id = $1
                ORDER BY o.tarih DESC
            `;

            const result = await db.query(query, [adisyonId]);

            // Adisyon bilgilerini al
            const adisyonQuery = `
                SELECT 
                    a.*,
                    m.ad as masa_adi,
                    k.ad as garson_adi,
                    k.soyad as garson_soyadi
                FROM adisyonlar a
                LEFT JOIN masalar m ON a.masa_id = m.id
                LEFT JOIN kullanicilar k ON a.garson_id = k.id
                WHERE a.id = $1
            `;
            const adisyonResult = await db.query(adisyonQuery, [adisyonId]);

            if (adisyonResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Adisyon bulunamadı'));
            }

            // Özet bilgileri al
            const ozetQuery = `
                SELECT 
                    COUNT(*) as toplam_islem,
                    SUM(CASE WHEN iptal_tarihi IS NULL THEN tutar ELSE 0 END) as toplam_tutar,
                    COUNT(CASE WHEN iptal_tarihi IS NOT NULL THEN 1 END) as iptal_sayisi,
                    SUM(CASE WHEN iptal_tarihi IS NOT NULL THEN tutar ELSE 0 END) as iptal_tutar,
                    COUNT(DISTINCT odeme_yontemi) as odeme_yontemi_sayisi
                FROM odemeler
                WHERE adisyon_id = $1
            `;
            const ozetResult = await db.query(ozetQuery, [adisyonId]);

            return res.json(this.successResponse({
                data: result.rows,
                adisyon: adisyonResult.rows[0],
                ozet: ozetResult.rows[0]
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Tarih aralığı raporu
    static async getGunlukRapor(req, res) {
        try {
            const { tarih = new Date().toISOString().split('T')[0] } = req.query;

            const query = `
                SELECT 
                    odeme_yontemi,
                    COUNT(*) as islem_sayisi,
                    SUM(CASE WHEN iptal_tarihi IS NULL THEN tutar ELSE 0 END) as toplam_tutar,
                    COUNT(CASE WHEN iptal_tarihi IS NOT NULL THEN 1 END) as iptal_sayisi,
                    SUM(CASE WHEN iptal_tarihi IS NOT NULL THEN tutar ELSE 0 END) as iptal_tutar
                FROM odemeler
                WHERE DATE(tarih) = $1
                GROUP BY odeme_yontemi
                ORDER BY odeme_yontemi
            `;

            const result = await db.query(query, [tarih]);

            // Günlük toplam
            const toplamQuery = `
                SELECT 
                    COUNT(*) as toplam_islem,
                    SUM(CASE WHEN iptal_tarihi IS NULL THEN tutar ELSE 0 END) as toplam_tutar,
                    COUNT(CASE WHEN iptal_tarihi IS NOT NULL THEN 1 END) as toplam_iptal,
                    SUM(CASE WHEN iptal_tarihi IS NOT NULL THEN tutar ELSE 0 END) as toplam_iptal_tutar
                FROM odemeler
                WHERE DATE(tarih) = $1
            `;

            const toplamResult = await db.query(toplamQuery, [tarih]);

            return res.json(this.successResponse({
                odemeler: result.rows,
                ozet: toplamResult.rows[0]
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    static async getTarihAraligiRapor(req, res) {
        try {
            const { baslangic, bitis } = req.query;

            if (!baslangic || !bitis) {
                return res.status(400).json(this.errorResponse('Başlangıç ve bitiş tarihleri zorunludur'));
            }

            const query = `
                SELECT 
                    DATE(tarih) as tarih,
                    odeme_yontemi,
                    COUNT(*) as islem_sayisi,
                    SUM(CASE WHEN iptal_tarihi IS NULL THEN tutar ELSE 0 END) as toplam_tutar,
                    COUNT(CASE WHEN iptal_tarihi IS NOT NULL THEN 1 END) as iptal_sayisi,
                    SUM(CASE WHEN iptal_tarihi IS NOT NULL THEN tutar ELSE 0 END) as iptal_tutar
                FROM odemeler
                WHERE DATE(tarih) BETWEEN $1 AND $2
                GROUP BY DATE(tarih), odeme_yontemi
                ORDER BY DATE(tarih), odeme_yontemi
            `;

            const result = await db.query(query, [baslangic, bitis]);

            // Dönem toplamı
            const toplamQuery = `
                SELECT 
                    COUNT(*) as toplam_islem,
                    SUM(CASE WHEN iptal_tarihi IS NULL THEN tutar ELSE 0 END) as toplam_tutar,
                    COUNT(CASE WHEN iptal_tarihi IS NOT NULL THEN 1 END) as toplam_iptal,
                    SUM(CASE WHEN iptal_tarihi IS NOT NULL THEN tutar ELSE 0 END) as toplam_iptal_tutar
                FROM odemeler
                WHERE DATE(tarih) BETWEEN $1 AND $2
            `;

            const toplamResult = await db.query(toplamQuery, [baslangic, bitis]);

            return res.json(this.successResponse({
                odemeler: result.rows,
                ozet: toplamResult.rows[0]
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Ödeme güncelle
    static async update(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;
            const { tutar, odeme_yontemi, aciklama } = req.body;

            await client.query('BEGIN');

            // Ödeme kontrolü
            const checkQuery = `
                SELECT o.*, a.durum as adisyon_durum, a.toplam_tutar as adisyon_tutar
                FROM odemeler o
                LEFT JOIN adisyonlar a ON o.adisyon_id = a.id
                WHERE o.id = $1
            `;
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Ödeme bulunamadı'));
            }

            const odeme = checkResult.rows[0];

            if (odeme.iptal_tarihi) {
                return res.status(400).json(this.errorResponse('İptal edilmiş ödeme güncellenemez'));
            }

            if (odeme.adisyon_durum === 'kapali') {
                return res.status(400).json(this.errorResponse('Kapalı adisyona ait ödeme güncellenemez'));
            }

            // Toplam ödemeleri kontrol et
            const odemelerQuery = `
                SELECT SUM(tutar) as toplam_odeme 
                FROM odemeler 
                WHERE adisyon_id = $1 AND id != $2
            `;
            const odemelerResult = await client.query(odemelerQuery, [odeme.adisyon_id, id]);
            const toplamOdeme = parseFloat(odemelerResult.rows[0].toplam_odeme || 0);
            const yeniToplam = toplamOdeme + parseFloat(tutar);

            if (yeniToplam > odeme.adisyon_tutar) {
                return res.status(400).json(this.errorResponse('Ödeme tutarı adisyon tutarını aşamaz'));
            }

            // Ödemeyi güncelle
            const updateQuery = `
                UPDATE odemeler
                SET 
                    tutar = $1,
                    odeme_yontemi = $2,
                    aciklama = $3,
                    guncelleme_tarihi = CURRENT_TIMESTAMP,
                    guncelleyen_kullanici_id = $4
                WHERE id = $5
                RETURNING *
            `;

            const result = await client.query(updateQuery, [
                tutar,
                odeme_yontemi,
                aciklama,
                req.user.id,
                id
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

            // Eski tutardan yeni tutarı çıkar
            const tutarFarki = parseFloat(tutar) - parseFloat(odeme.tutar);
            const kasaHareketiTipi = tutarFarki >= 0 ? 'giris' : 'cikis';

            await client.query(kasaHareketiQuery, [
                kasaHareketiTipi,
                Math.abs(tutarFarki),
                odeme_yontemi,
                req.user.id,
                id,
                'odeme_guncelleme',
                `Ödeme güncelleme: ${aciklama || ''}`
            ]);

            await client.query('COMMIT');

            return res.json(this.successResponse(result.rows[0], 'Ödeme başarıyla güncellendi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    // Ödeme sil
    static async delete(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;

            await client.query('BEGIN');

            // Ödeme kontrolü
            const checkQuery = `
                SELECT o.*, a.durum as adisyon_durum
                FROM odemeler o
                LEFT JOIN adisyonlar a ON o.adisyon_id = a.id
                WHERE o.id = $1
            `;
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Ödeme bulunamadı'));
            }

            const odeme = checkResult.rows[0];

            if (odeme.iptal_tarihi) {
                return res.status(400).json(this.errorResponse('İptal edilmiş ödeme silinemez'));
            }

            if (odeme.adisyon_durum === 'kapali') {
                return res.status(400).json(this.errorResponse('Kapalı adisyona ait ödeme silinemez'));
            }

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
                'cikis',
                odeme.tutar,
                odeme.odeme_yontemi,
                req.user.id,
                id,
                'odeme_silme',
                'Ödeme silindi'
            ]);

            // Ödemeyi sil
            const deleteQuery = `DELETE FROM odemeler WHERE id = $1 RETURNING *`;
            const result = await client.query(deleteQuery, [id]);

            await client.query('COMMIT');

            return res.json(this.successResponse(result.rows[0], 'Ödeme başarıyla silindi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    // Ödeme tipine göre ödemeleri getir
    static async getByTip(req, res) {
        try {
            const { tip } = req.params;
            const { limit = 10, offset = 0 } = req.query;

            const query = `
                SELECT 
                    o.*,
                    k.ad as kasiyer_adi,
                    k.soyad as kasiyer_soyadi,
                    a.masa_id,
                    m.ad as masa_adi
                FROM odemeler o
                LEFT JOIN kullanicilar k ON o.kasiyer_id = k.id
                LEFT JOIN adisyonlar a ON o.adisyon_id = a.id
                LEFT JOIN masalar m ON a.masa_id = m.id
                WHERE o.odeme_yontemi = $1
                ORDER BY o.tarih DESC
                LIMIT $2 OFFSET $3
            `;

            const result = await db.query(query, [tip, limit, offset]);

            // Toplam kayıt sayısını al
            const countQuery = `
                SELECT COUNT(*) as total
                FROM odemeler
                WHERE odeme_yontemi = $1
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

    // Cariye göre ödemeleri getir
    static async getByCari(req, res) {
        try {
            const { cariId } = req.params;
            const { limit = 10, offset = 0 } = req.query;

            const query = `
                SELECT 
                    o.*,
                    k.ad as kasiyer_adi,
                    k.soyad as kasiyer_soyadi,
                    a.masa_id,
                    m.ad as masa_adi,
                    c.unvan as cari_unvan
                FROM odemeler o
                LEFT JOIN kullanicilar k ON o.kasiyer_id = k.id
                LEFT JOIN adisyonlar a ON o.adisyon_id = a.id
                LEFT JOIN masalar m ON a.masa_id = m.id
                LEFT JOIN cariler c ON o.cari_id = c.id
                WHERE o.cari_id = $1
                ORDER BY o.tarih DESC
                LIMIT $2 OFFSET $3
            `;

            const result = await db.query(query, [cariId, limit, offset]);

            // Toplam kayıt sayısını al
            const countQuery = `
                SELECT COUNT(*) as total
                FROM odemeler
                WHERE cari_id = $1
            `;
            const countResult = await db.query(countQuery, [cariId]);

            // Cari bilgilerini al
            const cariQuery = `
                SELECT *
                FROM cariler
                WHERE id = $1
            `;
            const cariResult = await db.query(cariQuery, [cariId]);

            if (cariResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Cari bulunamadı'));
            }

            // Cari özet bilgilerini al
            const ozetQuery = `
                SELECT 
                    COUNT(*) as toplam_islem,
                    SUM(CASE WHEN iptal_tarihi IS NULL THEN tutar ELSE 0 END) as toplam_tutar,
                    COUNT(CASE WHEN iptal_tarihi IS NOT NULL THEN 1 END) as iptal_sayisi,
                    SUM(CASE WHEN iptal_tarihi IS NOT NULL THEN tutar ELSE 0 END) as iptal_tutar
                FROM odemeler
                WHERE cari_id = $1
            `;
            const ozetResult = await db.query(ozetQuery, [cariId]);

            return res.json(this.successResponse({
                data: result.rows,
                total: parseInt(countResult.rows[0].total),
                limit: parseInt(limit),
                offset: parseInt(offset),
                cari: cariResult.rows[0],
                ozet: ozetResult.rows[0]
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Tarih aralığına göre ödemeleri getir
    static async getByTarihAralik(req, res) {
        try {
            const { baslangic, bitis } = req.query;
            const { limit = 10, offset = 0 } = req.query;

            if (!baslangic || !bitis) {
                return res.status(400).json(this.errorResponse('Başlangıç ve bitiş tarihleri zorunludur'));
            }

            const query = `
                SELECT 
                    o.*,
                    k.ad as kasiyer_adi,
                    k.soyad as kasiyer_soyadi,
                    a.masa_id,
                    m.ad as masa_adi,
                    c.unvan as cari_unvan
                FROM odemeler o
                LEFT JOIN kullanicilar k ON o.kasiyer_id = k.id
                LEFT JOIN adisyonlar a ON o.adisyon_id = a.id
                LEFT JOIN masalar m ON a.masa_id = m.id
                LEFT JOIN cariler c ON o.cari_id = c.id
                WHERE DATE(o.tarih) BETWEEN $1 AND $2
                ORDER BY o.tarih DESC
                LIMIT $3 OFFSET $4
            `;

            const result = await db.query(query, [baslangic, bitis, limit, offset]);

            // Toplam kayıt sayısını al
            const countQuery = `
                SELECT COUNT(*) as total
                FROM odemeler
                WHERE DATE(tarih) BETWEEN $1 AND $2
            `;
            const countResult = await db.query(countQuery, [baslangic, bitis]);

            // Özet bilgileri al
            const ozetQuery = `
                SELECT 
                    COUNT(*) as toplam_islem,
                    SUM(CASE WHEN iptal_tarihi IS NULL THEN tutar ELSE 0 END) as toplam_tutar,
                    COUNT(CASE WHEN iptal_tarihi IS NOT NULL THEN 1 END) as iptal_sayisi,
                    SUM(CASE WHEN iptal_tarihi IS NOT NULL THEN tutar ELSE 0 END) as iptal_tutar,
                    COUNT(DISTINCT odeme_yontemi) as odeme_yontemi_sayisi
                FROM odemeler
                WHERE DATE(tarih) BETWEEN $1 AND $2
            `;
            const ozetResult = await db.query(ozetQuery, [baslangic, bitis]);

            // Ödeme yöntemlerine göre dağılım
            const dagilimQuery = `
                SELECT 
                    odeme_yontemi,
                    COUNT(*) as islem_sayisi,
                    SUM(CASE WHEN iptal_tarihi IS NULL THEN tutar ELSE 0 END) as toplam_tutar,
                    COUNT(CASE WHEN iptal_tarihi IS NOT NULL THEN 1 END) as iptal_sayisi,
                    SUM(CASE WHEN iptal_tarihi IS NOT NULL THEN tutar ELSE 0 END) as iptal_tutar
                FROM odemeler
                WHERE DATE(tarih) BETWEEN $1 AND $2
                GROUP BY odeme_yontemi
                ORDER BY toplam_tutar DESC
            `;
            const dagilimResult = await db.query(dagilimQuery, [baslangic, bitis]);

            return res.json(this.successResponse({
                data: result.rows,
                total: parseInt(countResult.rows[0].total),
                limit: parseInt(limit),
                offset: parseInt(offset),
                ozet: ozetResult.rows[0],
                dagilim: dagilimResult.rows
            }));
        } catch (error) {
            return res.status(500).json(this.errorResponse(error.message));
        }
    }

    // Ödeme iptali
    static async iptalEt(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;
            const { iptal_nedeni } = req.body;

            await client.query('BEGIN');

            // Ödeme kontrolü
            const checkQuery = `
                SELECT o.*, a.durum as adisyon_durum
                FROM odemeler o
                LEFT JOIN adisyonlar a ON o.adisyon_id = a.id
                WHERE o.id = $1
            `;
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Ödeme bulunamadı'));
            }

            const odeme = checkResult.rows[0];

            if (odeme.iptal_tarihi) {
                return res.status(400).json(this.errorResponse('Ödeme zaten iptal edilmiş'));
            }

            if (odeme.adisyon_durum === 'kapali') {
                return res.status(400).json(this.errorResponse('Kapalı adisyona ait ödeme iptal edilemez'));
            }

            // Ödemeyi iptal et
            const updateQuery = `
                UPDATE odemeler
                SET 
                    iptal_tarihi = CURRENT_TIMESTAMP,
                    iptal_nedeni = $1,
                    iptal_eden_kullanici_id = $2
                WHERE id = $3
                RETURNING *
            `;

            const result = await client.query(updateQuery, [
                iptal_nedeni,
                req.user.id,
                id
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
                'cikis',
                odeme.tutar,
                odeme.odeme_yontemi,
                req.user.id,
                id,
                'odeme_iptal',
                `Ödeme iptali: ${iptal_nedeni || ''}`
            ]);

            await client.query('COMMIT');

            return res.json(this.successResponse(result.rows[0], 'Ödeme başarıyla iptal edildi'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }

    // Ödeme onayı
    static async onayVer(req, res) {
        const client = await db.pool.connect();
        try {
            const { id } = req.params;
            const { onay_notu } = req.body;

            await client.query('BEGIN');

            // Ödeme kontrolü
            const checkQuery = `
                SELECT o.*, a.durum as adisyon_durum, a.toplam_tutar as adisyon_tutar
                FROM odemeler o
                LEFT JOIN adisyonlar a ON o.adisyon_id = a.id
                WHERE o.id = $1
            `;
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json(this.errorResponse('Ödeme bulunamadı'));
            }

            const odeme = checkResult.rows[0];

            if (odeme.onay_tarihi) {
                return res.status(400).json(this.errorResponse('Ödeme zaten onaylanmış'));
            }

            if (odeme.iptal_tarihi) {
                return res.status(400).json(this.errorResponse('İptal edilmiş ödeme onaylanamaz'));
            }

            // Toplam ödemeleri kontrol et
            const odemelerQuery = `
                SELECT SUM(tutar) as toplam_odeme 
                FROM odemeler 
                WHERE adisyon_id = $1 AND id != $2 AND onay_tarihi IS NOT NULL
            `;
            const odemelerResult = await client.query(odemelerQuery, [odeme.adisyon_id, id]);
            const toplamOdeme = parseFloat(odemelerResult.rows[0].toplam_odeme || 0);
            const yeniToplam = toplamOdeme + parseFloat(odeme.tutar);

            if (yeniToplam > odeme.adisyon_tutar) {
                return res.status(400).json(this.errorResponse('Onaylanan ödemeler adisyon tutarını aşamaz'));
            }

            // Ödemeyi onayla
            const updateQuery = `
                UPDATE odemeler
                SET 
                    onay_tarihi = CURRENT_TIMESTAMP,
                    onay_notu = $1,
                    onaylayan_kullanici_id = $2
                WHERE id = $3
                RETURNING *
            `;

            const result = await client.query(updateQuery, [
                onay_notu,
                req.user.id,
                id
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
                'giris',
                odeme.tutar,
                odeme.odeme_yontemi,
                req.user.id,
                id,
                'odeme_onay',
                `Ödeme onayı: ${onay_notu || ''}`
            ]);

            // Eğer adisyonun tüm ödemeleri onaylandıysa adisyonu kapat
            if (yeniToplam === odeme.adisyon_tutar) {
                const adisyonUpdateQuery = `
                    UPDATE adisyonlar
                    SET 
                        durum = 'kapali',
                        kapanis_tarihi = CURRENT_TIMESTAMP,
                        kapatan_kullanici_id = $1
                    WHERE id = $2
                `;
                await client.query(adisyonUpdateQuery, [req.user.id, odeme.adisyon_id]);
            }

            await client.query('COMMIT');

            return res.json(this.successResponse(result.rows[0], 'Ödeme başarıyla onaylandı'));
        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json(this.errorResponse(error.message));
        } finally {
            client.release();
        }
    }
}

module.exports = OdemeController; 