const db = require('../config/db');

class Adisyon {
  static async getAll(limit = 100, offset = 0) {
    const query = `
      SELECT a.*, 
             m.masa_numarasi,
             c.ad as musteri_ad, c.soyad as musteri_soyad,
             p.ad as personel_ad, p.soyad as personel_soyad
      FROM adisyonlar a
      LEFT JOIN masalar m ON a.masa_id = m.id
      LEFT JOIN cariler c ON a.cari_id = c.id
      LEFT JOIN cariler p ON a.personel_id = p.id
      ORDER BY a.olusturma_tarihi DESC
      LIMIT $1 OFFSET $2
    `;
    return (await db.query(query, [limit, offset])).rows;
  }

  static async getById(id) {
    const query = `
      SELECT a.*, 
             m.masa_numarasi,
             c.ad as musteri_ad, c.soyad as musteri_soyad,
             p.ad as personel_ad, p.soyad as personel_soyad
      FROM adisyonlar a
      LEFT JOIN masalar m ON a.masa_id = m.id
      LEFT JOIN cariler c ON a.cari_id = c.id
      LEFT JOIN cariler p ON a.personel_id = p.id
      WHERE a.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getByMasa(masaId) {
    const query = `
      SELECT a.*, 
             m.masa_numarasi,
             c.ad as musteri_ad, c.soyad as musteri_soyad,
             p.ad as personel_ad, p.soyad as personel_soyad
      FROM adisyonlar a
      LEFT JOIN masalar m ON a.masa_id = m.id
      LEFT JOIN cariler c ON a.cari_id = c.id
      LEFT JOIN cariler p ON a.personel_id = p.id
      WHERE a.masa_id = $1 AND a.durum = 'Acik'
      ORDER BY a.olusturma_tarihi DESC
    `;
    return (await db.query(query, [masaId])).rows;
  }

  static async create(adisyonData) {
    const {
      masa_id,
      cari_id,
      personel_id,
      odeme_tipi
    } = adisyonData;

    const query = `
      INSERT INTO adisyonlar (
        masa_id, cari_id, personel_id, odeme_tipi
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await db.query(query, [
      masa_id,
      cari_id,
      personel_id,
      odeme_tipi
    ]);

    if (masa_id) {
      await db.query(
        'UPDATE masalar SET durum = $1 WHERE id = $2',
        ['Dolu', masa_id]
      );
    }

    return result.rows[0];
  }

  static async update(id, adisyonData) {
    const {
      cari_id,
      indirim_tutari,
      odeme_tipi,
      durum
    } = adisyonData;

    const query = `
      UPDATE adisyonlar
      SET cari_id = COALESCE($1, cari_id),
          indirim_tutari = COALESCE($2, indirim_tutari),
          odeme_tipi = COALESCE($3, odeme_tipi),
          durum = COALESCE($4, durum),
          kapanis_zamani = CASE 
            WHEN $4 = 'Kapali' AND durum != 'Kapali' THEN NOW()
            ELSE kapanis_zamani
          END
      WHERE id = $5
      RETURNING *
    `;

    const result = await db.query(query, [
      cari_id,
      indirim_tutari,
      odeme_tipi,
      durum,
      id
    ]);

    return result.rows[0];
  }

  static async getDetayli(id) {
    const adisyon = await this.getById(id);
    if (!adisyon) return null;

    // Adisyon kalemleri
    const kalemlerQuery = `
      SELECT ak.*, u.ad as urun_adi
      FROM adisyon_kalemleri ak
      JOIN urunler u ON ak.urun_id = u.id
      WHERE ak.adisyon_id = $1
      ORDER BY ak.olusturma_tarihi
    `;
    const kalemler = (await db.query(kalemlerQuery, [id])).rows;

    // Ödemeler
    const odemelerQuery = `
      SELECT *
      FROM odemeler
      WHERE adisyon_id = $1
      ORDER BY olusturma_tarihi
    `;
    const odemeler = (await db.query(odemelerQuery, [id])).rows;

    return {
      ...adisyon,
      kalemler,
      odemeler
    };
  }

  static async iptalEt(id, aciklama = '') {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Adisyonu iptal et
      const updateQuery = `
        UPDATE adisyonlar
        SET durum = 'Iptal',
            kapanis_zamani = NOW()
        WHERE id = $1
        RETURNING *
      `;
      const result = await client.query(updateQuery, [id]);
      const adisyon = result.rows[0];

      // Masayı boşalt
      if (adisyon.masa_id) {
        await client.query(
          'UPDATE masalar SET durum = $1 WHERE id = $2',
          ['Boş', adisyon.masa_id]
        );
      }

      await client.query('COMMIT');
      return adisyon;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async getRaporlar(baslangicTarihi, bitisTarihi) {
    const query = `
      SELECT 
        COUNT(*) as adisyon_sayisi,
        SUM(toplam_tutar) as toplam_ciro,
        SUM(indirim_tutari) as toplam_indirim,
        SUM(odenen_tutar) as toplam_tahsilat,
        AVG(toplam_tutar) as ortalama_adisyon_tutari,
        COUNT(CASE WHEN durum = 'Iptal' THEN 1 END) as iptal_sayisi,
        COUNT(CASE WHEN masa_id IS NULL THEN 1 END) as paket_siparis_sayisi,
        COUNT(CASE WHEN masa_id IS NOT NULL THEN 1 END) as masa_siparis_sayisi
      FROM adisyonlar
      WHERE olusturma_tarihi BETWEEN $1 AND $2
    `;
    const result = await db.query(query, [baslangicTarihi, bitisTarihi]);
    return result.rows[0];
  }
}

module.exports = Adisyon; 