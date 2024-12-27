const db = require('../config/db');

class StokHareketi {
  static async getAll(limit = 100, offset = 0) {
    const query = `
      SELECT sh.*, u.ad as urun_adi
      FROM stok_hareketleri sh
      JOIN urunler u ON sh.urun_id = u.id
      ORDER BY sh.olusturma_tarihi DESC
      LIMIT $1 OFFSET $2
    `;
    return (await db.query(query, [limit, offset])).rows;
  }

  static async getById(id) {
    const query = `
      SELECT sh.*, u.ad as urun_adi
      FROM stok_hareketleri sh
      JOIN urunler u ON sh.urun_id = u.id
      WHERE sh.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getByUrunId(urunId, limit = 100, offset = 0) {
    const query = `
      SELECT sh.*, u.ad as urun_adi
      FROM stok_hareketleri sh
      JOIN urunler u ON sh.urun_id = u.id
      WHERE sh.urun_id = $1
      ORDER BY sh.olusturma_tarihi DESC
      LIMIT $2 OFFSET $3
    `;
    return (await db.query(query, [urunId, limit, offset])).rows;
  }

  static async create(hareketData) {
    const {
      urun_id,
      hareket_tipi,
      miktar,
      birim,
      kaynak,
      referans_id,
      aciklama
    } = hareketData;

    const query = `
      INSERT INTO stok_hareketleri (
        urun_id, hareket_tipi, miktar, birim,
        kaynak, referans_id, aciklama
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await db.query(query, [
      urun_id,
      hareket_tipi,
      miktar,
      birim,
      kaynak,
      referans_id,
      aciklama
    ]);

    return result.rows[0];
  }

  static async getByDateRange(baslangicTarihi, bitisTarihi, limit = 100, offset = 0) {
    const query = `
      SELECT sh.*, u.ad as urun_adi
      FROM stok_hareketleri sh
      JOIN urunler u ON sh.urun_id = u.id
      WHERE sh.olusturma_tarihi BETWEEN $1 AND $2
      ORDER BY sh.olusturma_tarihi DESC
      LIMIT $3 OFFSET $4
    `;
    return (await db.query(query, [baslangicTarihi, bitisTarihi, limit, offset])).rows;
  }

  static async getByKaynak(kaynak, limit = 100, offset = 0) {
    const query = `
      SELECT sh.*, u.ad as urun_adi
      FROM stok_hareketleri sh
      JOIN urunler u ON sh.urun_id = u.id
      WHERE sh.kaynak = $1
      ORDER BY sh.olusturma_tarihi DESC
      LIMIT $2 OFFSET $3
    `;
    return (await db.query(query, [kaynak, limit, offset])).rows;
  }

  static async getByReferansId(referansId) {
    const query = `
      SELECT sh.*, u.ad as urun_adi
      FROM stok_hareketleri sh
      JOIN urunler u ON sh.urun_id = u.id
      WHERE sh.referans_id = $1
      ORDER BY sh.olusturma_tarihi DESC
    `;
    return (await db.query(query, [referansId])).rows;
  }

  static async getOzet(baslangicTarihi, bitisTarihi) {
    const query = `
      SELECT 
        u.id as urun_id,
        u.ad as urun_adi,
        u.birim,
        SUM(CASE WHEN sh.hareket_tipi = 'Giriş' THEN sh.miktar ELSE 0 END) as toplam_giris,
        SUM(CASE WHEN sh.hareket_tipi = 'Çıkış' THEN sh.miktar ELSE 0 END) as toplam_cikis,
        COUNT(*) as hareket_sayisi
      FROM stok_hareketleri sh
      JOIN urunler u ON sh.urun_id = u.id
      WHERE sh.olusturma_tarihi BETWEEN $1 AND $2
      GROUP BY u.id, u.ad, u.birim
      ORDER BY u.ad
    `;
    return (await db.query(query, [baslangicTarihi, bitisTarihi])).rows;
  }
}

module.exports = StokHareketi; 