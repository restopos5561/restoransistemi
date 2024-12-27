const db = require('../config/db');

class Masa {
  static async getAll() {
    const query = 'SELECT * FROM masalar ORDER BY masa_numarasi';
    return (await db.query(query)).rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM masalar WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(masaData) {
    const { masa_numarasi, kapasite } = masaData;
    const query = `
      INSERT INTO masalar (masa_numarasi, kapasite)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [masa_numarasi, kapasite]);
    return result.rows[0];
  }

  static async update(id, masaData) {
    const { masa_numarasi, kapasite, durum } = masaData;
    const query = `
      UPDATE masalar
      SET masa_numarasi = $1,
          kapasite = $2,
          durum = $3,
          guncelleme_tarihi = NOW()
      WHERE id = $4
      RETURNING *
    `;
    const result = await db.query(query, [
      masa_numarasi,
      kapasite,
      durum,
      id
    ]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM masalar WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updateDurum(id, durum) {
    const query = `
      UPDATE masalar
      SET durum = $1,
          guncelleme_tarihi = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [durum, id]);
    return result.rows[0];
  }

  static async getAktifAdisyonlar(masaId) {
    const query = `
      SELECT * FROM adisyonlar 
      WHERE masa_id = $1 AND durum = 'Aktif'
      ORDER BY olusturma_tarihi DESC
    `;
    const result = await db.query(query, [masaId]);
    return result.rows;
  }

  static async getTumAdisyonlar(masaId) {
    const query = `
      SELECT * FROM adisyonlar 
      WHERE masa_id = $1
      ORDER BY olusturma_tarihi DESC
    `;
    const result = await db.query(query, [masaId]);
    return result.rows;
  }

  static tableName = 'masalar';

  static async getByBolge(bolge_id) {
    const query = `SELECT * FROM ${this.tableName} WHERE bolge_id = $1`;
    const result = await db.query(query, [bolge_id]);
    return result.rows;
  }

  static async getByDurum(durum) {
    const query = `SELECT * FROM ${this.tableName} WHERE durum = $1 ORDER BY masa_numarasi`;
    const result = await db.query(query, [durum]);
    return result.rows;
  }

  static async rezervasyonYap(masa_id, rezervasyonData) {
    const { 
      baslangic_tarihi,
      bitis_tarihi,
      musteri_adi,
      kisi_sayisi,
      notlar,
      kullanici_id 
    } = rezervasyonData;

    const masaKontrol = await db.query(
      `SELECT * FROM rezervasyonlar 
       WHERE masa_id = $1 
       AND ((baslangic_tarihi, bitis_tarihi) OVERLAPS ($2::timestamp, $3::timestamp))`,
      [masa_id, baslangic_tarihi, bitis_tarihi]
    );

    if (masaKontrol.rows.length > 0) {
      throw new Error('Bu masa seçilen zaman aralığında dolu');
    }

    const result = await db.query(
      `INSERT INTO rezervasyonlar 
       (masa_id, baslangic_tarihi, bitis_tarihi, musteri_adi, kisi_sayisi, notlar, kullanici_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [masa_id, baslangic_tarihi, bitis_tarihi, musteri_adi, kisi_sayisi, notlar, kullanici_id]
    );

    await db.query(
      `UPDATE ${this.tableName} 
       SET durum = 'rezerve' 
       WHERE id = $1`,
      [masa_id]
    );

    return result.rows[0];
  }
}

module.exports = Masa; 