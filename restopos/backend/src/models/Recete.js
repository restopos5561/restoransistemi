const db = require('../config/db');

class Recete {
  static async getAll() {
    const query = `
      SELECT r.*, 
             COUNT(rk.id) as malzeme_sayisi
      FROM receteler r
      LEFT JOIN recete_kalemleri rk ON r.id = rk.recete_id
      GROUP BY r.id
      ORDER BY r.ad
    `;
    return (await db.query(query)).rows;
  }

  static async getById(id) {
    const query = `
      SELECT r.*,
             json_agg(
               json_build_object(
                 'id', rk.id,
                 'urun_id', rk.urun_id,
                 'urun_adi', u.ad,
                 'miktar', rk.miktar,
                 'birim', rk.birim
               )
             ) as malzemeler
      FROM receteler r
      LEFT JOIN recete_kalemleri rk ON r.id = rk.recete_id
      LEFT JOIN urunler u ON rk.urun_id = u.id
      WHERE r.id = $1
      GROUP BY r.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(receteData) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const { ad, aciklama, malzemeler } = receteData;

      // Reçeteyi oluştur
      const receteQuery = `
        INSERT INTO receteler (ad, aciklama)
        VALUES ($1, $2)
        RETURNING *
      `;
      const receteResult = await client.query(receteQuery, [ad, aciklama]);
      const recete = receteResult.rows[0];

      // Malzemeleri ekle
      if (malzemeler && malzemeler.length > 0) {
        const malzemeQuery = `
          INSERT INTO recete_kalemleri (recete_id, urun_id, miktar, birim)
          VALUES ($1, $2, $3, $4)
        `;
        for (const malzeme of malzemeler) {
          await client.query(malzemeQuery, [
            recete.id,
            malzeme.urun_id,
            malzeme.miktar,
            malzeme.birim
          ]);
        }
      }

      await client.query('COMMIT');
      return await this.getById(recete.id);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async update(id, receteData) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const { ad, aciklama, malzemeler } = receteData;

      // Reçeteyi güncelle
      const receteQuery = `
        UPDATE receteler
        SET ad = COALESCE($1, ad),
            aciklama = COALESCE($2, aciklama)
        WHERE id = $3
        RETURNING *
      `;
      const receteResult = await client.query(receteQuery, [ad, aciklama, id]);
      const recete = receteResult.rows[0];

      if (!recete) {
        throw new Error('Reçete bulunamadı');
      }

      // Malzemeleri güncelle
      if (malzemeler) {
        // Mevcut malzemeleri sil
        await client.query('DELETE FROM recete_kalemleri WHERE recete_id = $1', [id]);

        // Yeni malzemeleri ekle
        if (malzemeler.length > 0) {
          const malzemeQuery = `
            INSERT INTO recete_kalemleri (recete_id, urun_id, miktar, birim)
            VALUES ($1, $2, $3, $4)
          `;
          for (const malzeme of malzemeler) {
            await client.query(malzemeQuery, [
              id,
              malzeme.urun_id,
              malzeme.miktar,
              malzeme.birim
            ]);
          }
        }
      }

      await client.query('COMMIT');
      return await this.getById(id);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM receteler WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getMalzemeler(id) {
    const query = `
      SELECT rk.*, u.ad as urun_adi, u.birim as urun_birim
      FROM recete_kalemleri rk
      JOIN urunler u ON rk.urun_id = u.id
      WHERE rk.recete_id = $1
      ORDER BY u.ad
    `;
    return (await db.query(query, [id])).rows;
  }

  static async malzemeyeGoreAra(urunId) {
    const query = `
      SELECT r.*, 
             json_agg(
               json_build_object(
                 'urun_id', rk.urun_id,
                 'urun_adi', u.ad,
                 'miktar', rk.miktar,
                 'birim', rk.birim
               )
             ) as malzemeler
      FROM receteler r
      JOIN recete_kalemleri rk ON r.id = rk.recete_id
      JOIN urunler u ON rk.urun_id = u.id
      WHERE EXISTS (
        SELECT 1 
        FROM recete_kalemleri rk2 
        WHERE rk2.recete_id = r.id 
        AND rk2.urun_id = $1
      )
      GROUP BY r.id
      ORDER BY r.ad
    `;
    return (await db.query(query, [urunId])).rows;
  }
}

module.exports = Recete; 