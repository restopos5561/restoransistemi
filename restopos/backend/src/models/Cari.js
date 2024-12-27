const db = require('../config/db');

class Cari {
  static async getAll(aktifOnly = true) {
    const query = `
      SELECT *
      FROM cariler
      WHERE ($1 = false OR aktif = true)
      ORDER BY ad, soyad
    `;
    return (await db.query(query, [aktifOnly])).rows;
  }

  static async getById(id) {
    const query = `
      SELECT *
      FROM cariler
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getByTip(tip, aktifOnly = true) {
    const query = `
      SELECT *
      FROM cariler
      WHERE cari_tipi = $1 AND ($2 = false OR aktif = true)
      ORDER BY ad, soyad
    `;
    return (await db.query(query, [tip, aktifOnly])).rows;
  }

  static async create(cariData) {
    const {
      cari_tipi,
      ad,
      soyad,
      unvan,
      telefon,
      e_posta,
      adres,
      vergi_dairesi,
      vergi_numarasi,
      aktif
    } = cariData;

    const query = `
      INSERT INTO cariler (
        cari_tipi, ad, soyad, unvan, telefon,
        e_posta, adres, vergi_dairesi, vergi_numarasi, aktif
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await db.query(query, [
      cari_tipi,
      ad,
      soyad,
      unvan,
      telefon,
      e_posta,
      adres,
      vergi_dairesi,
      vergi_numarasi,
      aktif !== undefined ? aktif : true
    ]);

    return result.rows[0];
  }

  static async update(id, cariData) {
    const {
      ad,
      soyad,
      unvan,
      telefon,
      e_posta,
      adres,
      vergi_dairesi,
      vergi_numarasi,
      aktif
    } = cariData;

    const query = `
      UPDATE cariler
      SET ad = COALESCE($1, ad),
          soyad = $2,
          unvan = $3,
          telefon = $4,
          e_posta = $5,
          adres = $6,
          vergi_dairesi = $7,
          vergi_numarasi = $8,
          aktif = COALESCE($9, aktif)
      WHERE id = $10
      RETURNING *
    `;

    const result = await db.query(query, [
      ad,
      soyad,
      unvan,
      telefon,
      e_posta,
      adres,
      vergi_dairesi,
      vergi_numarasi,
      aktif,
      id
    ]);

    return result.rows[0];
  }

  static async delete(id) {
    // Fiziksel silme yerine soft delete
    const query = `
      UPDATE cariler
      SET aktif = false
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async search(searchTerm, aktifOnly = true) {
    const query = `
      SELECT *
      FROM cariler
      WHERE (
        ad ILIKE $1 OR
        soyad ILIKE $1 OR
        unvan ILIKE $1 OR
        telefon ILIKE $1 OR
        e_posta ILIKE $1 OR
        vergi_numarasi ILIKE $1
      ) AND ($2 = false OR aktif = true)
      ORDER BY ad, soyad
    `;
    return (await db.query(query, [`%${searchTerm}%`, aktifOnly])).rows;
  }

  static async getBakiyeHareketleri(cariId, limit = 100, offset = 0) {
    const query = `
      SELECT *
      FROM cari_bakiye_hareketleri
      WHERE cari_id = $1
      ORDER BY olusturma_tarihi DESC
      LIMIT $2 OFFSET $3
    `;
    return (await db.query(query, [cariId, limit, offset])).rows;
  }

  static async addBakiyeHareketi(hareketData) {
    const {
      cari_id,
      hareket_tipi,
      tutar,
      aciklama,
      referans_id,
      referans_tipi
    } = hareketData;

    const query = `
      INSERT INTO cari_bakiye_hareketleri (
        cari_id, hareket_tipi, tutar, aciklama,
        referans_id, referans_tipi
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await db.query(query, [
      cari_id,
      hareket_tipi,
      tutar,
      aciklama,
      referans_id,
      referans_tipi
    ]);

    return result.rows[0];
  }

  static async getBorcluCariler(limit = 100, offset = 0) {
    const query = `
      SELECT *
      FROM cariler
      WHERE bakiye > 0 AND aktif = true
      ORDER BY bakiye DESC
      LIMIT $1 OFFSET $2
    `;
    return (await db.query(query, [limit, offset])).rows;
  }

  static async getAlacakliCariler(limit = 100, offset = 0) {
    const query = `
      SELECT *
      FROM cariler
      WHERE bakiye < 0 AND aktif = true
      ORDER BY bakiye ASC
      LIMIT $1 OFFSET $2
    `;
    return (await db.query(query, [limit, offset])).rows;
  }

  static async getBakiyeOzeti(cariId, baslangicTarihi, bitisTarihi) {
    const query = `
      SELECT 
        SUM(CASE WHEN hareket_tipi = 'Borç' THEN tutar ELSE 0 END) as toplam_borc,
        SUM(CASE WHEN hareket_tipi = 'Alacak' THEN tutar ELSE 0 END) as toplam_alacak,
        COUNT(*) as hareket_sayisi
      FROM cari_bakiye_hareketleri
      WHERE cari_id = $1
        AND olusturma_tarihi BETWEEN $2 AND $3
    `;
    const result = await db.query(query, [cariId, baslangicTarihi, bitisTarihi]);
    return result.rows[0];
  }
}

module.exports = Cari; 