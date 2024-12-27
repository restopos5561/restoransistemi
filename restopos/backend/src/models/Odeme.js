const db = require('../config/db');

class Odeme {
  static async getAll(adisyonId) {
    const query = `
      SELECT *
      FROM odemeler
      WHERE adisyon_id = $1
      ORDER BY olusturma_tarihi DESC
    `;
    return (await db.query(query, [adisyonId])).rows;
  }

  static async getById(id) {
    const query = `
      SELECT *
      FROM odemeler
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(odemeData) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const {
        adisyon_id,
        tutar,
        odeme_tipi,
        referans_no
      } = odemeData;

      // Adisyonu kontrol et
      const adisyonQuery = `
        SELECT toplam_tutar, indirim_tutari, odenen_tutar
        FROM adisyonlar
        WHERE id = $1 AND durum = 'Acik'
      `;
      const adisyonResult = await client.query(adisyonQuery, [adisyon_id]);
      const adisyon = adisyonResult.rows[0];

      if (!adisyon) {
        throw new Error('Adisyon bulunamadı veya kapalı');
      }

      const kalanTutar = adisyon.toplam_tutar - adisyon.indirim_tutari - adisyon.odenen_tutar;
      
      if (tutar > kalanTutar) {
        throw new Error('Ödeme tutarı kalan tutardan büyük olamaz');
      }

      // Ödemeyi kaydet
      const query = `
        INSERT INTO odemeler (
          adisyon_id, tutar, odeme_tipi, referans_no
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const result = await client.query(query, [
        adisyon_id,
        tutar,
        odeme_tipi,
        referans_no
      ]);

      // Eğer ödeme tamamlandıysa adisyonu kapat
      const yeniOdenenTutar = adisyon.odenen_tutar + tutar;
      if (yeniOdenenTutar >= (adisyon.toplam_tutar - adisyon.indirim_tutari)) {
        await client.query(`
          UPDATE adisyonlar
          SET durum = 'Kapali',
              kapanis_zamani = NOW(),
              odeme_tipi = $1
          WHERE id = $2
        `, [odeme_tipi, adisyon_id]);
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async iptalEt(id) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Ödemeyi bul
      const odemeQuery = 'SELECT * FROM odemeler WHERE id = $1';
      const odemeResult = await client.query(odemeQuery, [id]);
      const odeme = odemeResult.rows[0];

      if (!odeme) {
        throw new Error('Ödeme bulunamadı');
      }

      // Ödemeyi sil
      const deleteQuery = 'DELETE FROM odemeler WHERE id = $1 RETURNING *';
      const result = await client.query(deleteQuery, [id]);

      // Adisyonu güncelle
      await client.query(`
        UPDATE adisyonlar
        SET durum = 'Acik',
            kapanis_zamani = NULL
        WHERE id = $1 AND durum = 'Kapali'
      `, [odeme.adisyon_id]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async getOzetRapor(baslangicTarihi, bitisTarihi) {
    const query = `
      SELECT 
        odeme_tipi,
        COUNT(*) as islem_sayisi,
        SUM(tutar) as toplam_tutar,
        MIN(tutar) as min_tutar,
        MAX(tutar) as max_tutar,
        AVG(tutar) as ortalama_tutar
      FROM odemeler
      WHERE olusturma_tarihi BETWEEN $1 AND $2
      GROUP BY odeme_tipi
      ORDER BY toplam_tutar DESC
    `;
    return (await db.query(query, [baslangicTarihi, bitisTarihi])).rows;
  }

  static async getGunlukOzet(tarih) {
    const query = `
      SELECT 
        DATE_TRUNC('hour', olusturma_tarihi) as saat,
        odeme_tipi,
        COUNT(*) as islem_sayisi,
        SUM(tutar) as toplam_tutar
      FROM odemeler
      WHERE DATE_TRUNC('day', olusturma_tarihi) = DATE_TRUNC('day', $1::timestamp)
      GROUP BY DATE_TRUNC('hour', olusturma_tarihi), odeme_tipi
      ORDER BY saat, odeme_tipi
    `;
    return (await db.query(query, [tarih])).rows;
  }
}

module.exports = Odeme; 