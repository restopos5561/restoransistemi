const db = require('../config/db');

class stok {
  static async getAll() {
    const query = `
      SELECT s.*, u.ad as urun_adi, u.aktif as urun_aktif
      FROM stoklar s
      JOIN urunler u ON s.urun_id = u.id
      ORDER BY u.ad
    `;
    return (await db.query(query)).rows;
  }

  static async getById(id) {
    const query = `
      SELECT s.*, u.ad as urun_adi, u.aktif as urun_aktif
      FROM stoklar s
      JOIN urunler u ON s.urun_id = u.id
      WHERE s.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getByUrunId(urunId) {
    const query = `
      SELECT s.*, u.ad as urun_adi, u.aktif as urun_aktif
      FROM stoklar s
      JOIN urunler u ON s.urun_id = u.id
      WHERE s.urun_id = $1
    `;
    const result = await db.query(query, [urunId]);
    return result.rows[0];
  }

  static async create(stokData) {
    const {
      urun_id,
      mevcut_miktar,
      birim,
      kritik_stok_seviyesi
    } = stokData;

    const query = `
      INSERT INTO stoklar (
        urun_id, mevcut_miktar, birim, kritik_stok_seviyesi
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await db.query(query, [
      urun_id,
      mevcut_miktar || 0,
      birim,
      kritik_stok_seviyesi
    ]);

    return result.rows[0];
  }

  static async update(id, stokData) {
    const {
      mevcut_miktar,
      kritik_stok_seviyesi
    } = stokData;

    const query = `
      UPDATE stoklar
      SET mevcut_miktar = COALESCE($1, mevcut_miktar),
          kritik_stok_seviyesi = $2
      WHERE id = $3
      RETURNING *
    `;

    const result = await db.query(query, [
      mevcut_miktar,
      kritik_stok_seviyesi,
      id
    ]);

    return result.rows[0];
  }

  static async updateMiktar(id, miktar) {
    const query = `
      UPDATE stoklar
      SET mevcut_miktar = mevcut_miktar + $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [miktar, id]);
    return result.rows[0];
  }

  static async getKritikStoklar() {
    const query = `
      SELECT s.*, u.ad as urun_adi, u.aktif as urun_aktif
      FROM stoklar s
      JOIN urunler u ON s.urun_id = u.id
      WHERE s.kritik_stok_seviyesi IS NOT NULL
        AND s.mevcut_miktar <= s.kritik_stok_seviyesi
        AND u.aktif = true
      ORDER BY s.mevcut_miktar / s.kritik_stok_seviyesi
    `;
    return (await db.query(query)).rows;
  }

  static async getStokUyarilari(baslangicTarihi = null, bitisTarihi = null) {
    let query = `
      SELECT su.*, u.ad as urun_adi
      FROM stok_uyarilari su
      JOIN urunler u ON su.urun_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    if (baslangicTarihi) {
      params.push(baslangicTarihi);
      query += ` AND su.olusturma_tarihi >= $${params.length}`;
    }
    
    if (bitisTarihi) {
      params.push(bitisTarihi);
      query += ` AND su.olusturma_tarihi <= $${params.length}`;
    }
    
    query += ' ORDER BY su.olusturma_tarihi DESC';
    
    return (await db.query(query, params)).rows;
  }
}

module.exports = stok; 