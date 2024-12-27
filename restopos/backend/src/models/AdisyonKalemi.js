const db = require('../config/db');

class AdisyonKalemi {
  static async getAll(adisyonId) {
    const query = `
      SELECT ak.*, u.ad as urun_adi, u.birim
      FROM adisyon_kalemleri ak
      JOIN urunler u ON ak.urun_id = u.id
      WHERE ak.adisyon_id = $1
      ORDER BY ak.olusturma_tarihi
    `;
    return (await db.query(query, [adisyonId])).rows;
  }

  static async getById(id) {
    const query = `
      SELECT ak.*, u.ad as urun_adi, u.birim
      FROM adisyon_kalemleri ak
      JOIN urunler u ON ak.urun_id = u.id
      WHERE ak.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(kalemData) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const {
        adisyon_id,
        urun_id,
        adet,
        birim_fiyat,
        indirim_tutari = 0,
        aciklama
      } = kalemData;

      // Ürün fiyatını kontrol et
      const urunQuery = 'SELECT fiyat FROM urunler WHERE id = $1';
      const urunResult = await client.query(urunQuery, [urun_id]);
      const urun = urunResult.rows[0];

      if (!urun) {
        throw new Error('Ürün bulunamadı');
      }

      // Eğer birim fiyat belirtilmemişse ürünün fiyatını kullan
      const finalBirimFiyat = birim_fiyat || urun.fiyat;
      const toplamFiyat = (adet * finalBirimFiyat) - indirim_tutari;

      const query = `
        INSERT INTO adisyon_kalemleri (
          adisyon_id, urun_id, adet, birim_fiyat,
          toplam_fiyat, indirim_tutari, aciklama
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const result = await client.query(query, [
        adisyon_id,
        urun_id,
        adet,
        finalBirimFiyat,
        toplamFiyat,
        indirim_tutari,
        aciklama
      ]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async update(id, kalemData) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const {
        adet,
        indirim_tutari,
        aciklama
      } = kalemData;

      // Mevcut kalemi al
      const mevcutQuery = `
        SELECT * FROM adisyon_kalemleri WHERE id = $1
      `;
      const mevcutResult = await client.query(mevcutQuery, [id]);
      const mevcutKalem = mevcutResult.rows[0];

      if (!mevcutKalem) {
        throw new Error('Adisyon kalemi bulunamadı');
      }

      // Yeni toplam fiyatı hesapla
      const yeniToplamFiyat = (adet || mevcutKalem.adet) * mevcutKalem.birim_fiyat;
      const yeniIndirimTutari = indirim_tutari !== undefined ? indirim_tutari : mevcutKalem.indirim_tutari;
      const finalToplamFiyat = yeniToplamFiyat - yeniIndirimTutari;

      const query = `
        UPDATE adisyon_kalemleri
        SET adet = COALESCE($1, adet),
            toplam_fiyat = $2,
            indirim_tutari = COALESCE($3, indirim_tutari),
            aciklama = COALESCE($4, aciklama)
        WHERE id = $5
        RETURNING *
      `;

      const result = await client.query(query, [
        adet,
        finalToplamFiyat,
        indirim_tutari,
        aciklama,
        id
      ]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM adisyon_kalemleri WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getUrunOzeti(baslangicTarihi, bitisTarihi) {
    const query = `
      SELECT 
        u.id as urun_id,
        u.ad as urun_adi,
        u.birim,
        COUNT(*) as siparis_sayisi,
        SUM(ak.adet) as toplam_adet,
        SUM(ak.toplam_fiyat) as toplam_tutar,
        SUM(ak.indirim_tutari) as toplam_indirim
      FROM adisyon_kalemleri ak
      JOIN urunler u ON ak.urun_id = u.id
      JOIN adisyonlar a ON ak.adisyon_id = a.id
      WHERE a.olusturma_tarihi BETWEEN $1 AND $2
        AND a.aktif != 'iptal'
      GROUP BY u.id, u.ad, u.birim
      ORDER BY toplam_tutar DESC
    `;
    return (await db.query(query, [baslangicTarihi, bitisTarihi])).rows;
  }
}

module.exports = AdisyonKalemi; 