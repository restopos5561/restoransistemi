const db = require('../config/db');

class urun {
  static async getAll(aktifOnly = true) {
    const query = `
      SELECT u.*, k.ad as kategori_adi
      FROM urunler u
      LEFT JOIN urun_kategorileri k ON u.kategori_id = k.id
      WHERE ($1 = false OR u.aktif = true)
      ORDER BY k.ad, u.ad
    `;
    return (await db.query(query, [aktifOnly])).rows;
  }

  static async getById(id) {
    const query = `
      SELECT u.*, k.ad as kategori_adi
      FROM urunler u
      LEFT JOIN urun_kategorileri k ON u.kategori_id = k.id
      WHERE u.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getByKategori(kategoriId, aktifOnly = true) {
    const query = `
      SELECT u.*, k.ad as kategori_adi
      FROM urunler u
      LEFT JOIN urun_kategorileri k ON u.kategori_id = k.id
      WHERE u.kategori_id = $1 AND ($2 = false OR u.aktif = true)
      ORDER BY u.ad
    `;
    return (await db.query(query, [kategoriId, aktifOnly])).rows;
  }

  static async create(urunData) {
    const {
      ad,
      aciklama,
      fiyat,
      kategori_id,
      barkod,
      birim,
      resim_url,
      aktif
    } = urunData;

    const query = `
      INSERT INTO urunler (
        ad, aciklama, fiyat, kategori_id, barkod, 
        birim, resim_url, aktif
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const result = await db.query(query, [
      ad,
      aciklama,
      fiyat,
      kategori_id,
      barkod,
      birim,
      resim_url,
      aktif !== undefined ? aktif : true
    ]);

    return result.rows[0];
  }

  static async update(id, urunData) {
    const {
      ad,
      aciklama,
      fiyat,
      kategori_id,
      barkod,
      birim,
      resim_url,
      aktif
    } = urunData;

    const query = `
      UPDATE urunler
      SET ad = $1,
          aciklama = $2,
          fiyat = $3,
          kategori_id = $4,
          barkod = $5,
          birim = $6,
          resim_url = $7,
          aktif = $8
      WHERE id = $9
      RETURNING *
    `;

    const result = await db.query(query, [
      ad,
      aciklama,
      fiyat,
      kategori_id,
      barkod,
      birim,
      resim_url,
      aktif,
      id
    ]);

    return result.rows[0];
  }

  static async delete(id) {
    // Fiziksel silme yerine soft delete
    const query = `
      UPDATE urunler
      SET aktif = false
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async searchByName(searchTerm, aktifOnly = true) {
    const query = `
      SELECT u.*, k.ad as kategori_adi
      FROM urunler u
      LEFT JOIN urun_kategorileri k ON u.kategori_id = k.id
      WHERE (u.ad ILIKE $1 OR u.barkod = $2) 
        AND ($3 = false OR u.aktif = true)
      ORDER BY u.ad
    `;
    return (await db.query(query, [
      `%${searchTerm}%`,
      searchTerm,
      aktifOnly
    ])).rows;
  }

  static async updateFiyat(id, yeniFiyat) {
    const query = `
      UPDATE urunler
      SET fiyat = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [yeniFiyat, id]);
    return result.rows[0];
  }

  static async getFiyatGecmisi(urunId) {
    const query = `
      SELECT *
      FROM fiyat_degisiklik_log
      WHERE urun_id = $1
      ORDER BY degisiklik_tarihi DESC
    `;
    return (await db.query(query, [urunId])).rows;
  }
}

module.exports = urun; 