const db = require('../config/db');

class UrunKategorisi {
  static async getAll() {
    const query = `
      SELECT 
        k.*,
        COUNT(u.id) as urun_sayisi
      FROM urun_kategorileri k
      LEFT JOIN urunler u ON k.id = u.kategori_id AND u.aktif = true
      GROUP BY k.id
      ORDER BY k.ad
    `;
    return (await db.query(query)).rows;
  }

  static async getById(id) {
    const query = `
      SELECT 
        k.*,
        COUNT(u.id) as urun_sayisi
      FROM urun_kategorileri k
      LEFT JOIN urunler u ON k.id = u.kategori_id AND u.aktif = true
      WHERE k.id = $1
      GROUP BY k.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(kategoriData) {
    const { ad, aciklama } = kategoriData;
    const query = `
      INSERT INTO urun_kategorileri (ad, aciklama)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [ad, aciklama]);
    return result.rows[0];
  }

  static async update(id, kategoriData) {
    const { ad, aciklama } = kategoriData;
    const query = `
      UPDATE urun_kategorileri
      SET ad = $1,
          aciklama = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(query, [ad, aciklama, id]);
    return result.rows[0];
  }

  static async delete(id) {
    // Önce kategoride aktif ürün var mı kontrol et
    const checkQuery = `
      SELECT COUNT(*) as urun_sayisi
      FROM urunler
      WHERE kategori_id = $1 AND aktif = true
    `;
    const checkResult = await db.query(checkQuery, [id]);
    
    if (checkResult.rows[0].urun_sayisi > 0) {
      throw new Error('Bu kategoride aktif ürünler var. Önce ürünleri başka bir kategoriye taşıyın veya silin.');
    }

    // Kategoriyi sil
    const query = 'DELETE FROM urun_kategorileri WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async searchByName(searchTerm) {
    const query = `
      SELECT 
        k.*,
        COUNT(u.id) as urun_sayisi
      FROM urun_kategorileri k
      LEFT JOIN urunler u ON k.id = u.kategori_id AND u.aktif = true
      WHERE k.ad ILIKE $1
      GROUP BY k.id
      ORDER BY k.ad
    `;
    return (await db.query(query, [`%${searchTerm}%`])).rows;
  }

  static async getWithUrunler(id) {
    const query = `
      SELECT 
        k.*,
        json_agg(
          json_build_object(
            'id', u.id,
            'ad', u.ad,
            'fiyat', u.fiyat,
            'birim', u.birim,
            'aktif', u.aktif
          ) ORDER BY u.ad
        ) FILTER (WHERE u.id IS NOT NULL) as urunler
      FROM urun_kategorileri k
      LEFT JOIN urunler u ON k.id = u.kategori_id AND u.aktif = true
      WHERE k.id = $1
      GROUP BY k.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = UrunKategorisi; 