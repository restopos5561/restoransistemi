const db = require('../config/db');

class mutfak {
    static tableName = 'mutfak_siparisleri';

    // Tüm mutfak siparişlerini getir
    static async getAll() {
        const query = `
            SELECT ms.*, u.ad as kullanici_adi, m.masa_numarasi
            FROM ${this.tableName} ms
            LEFT JOIN kullanicilar u ON ms.kullanici_id = u.id
            LEFT JOIN masalar m ON ms.masa_id = m.id
            ORDER BY ms.olusturma_tarihi DESC
        `;
        return (await db.query(query)).rows;
    }

    // Belirli bir mutfak siparişini getir
    static async getById(id) {
        const query = `
            SELECT ms.*, u.ad as kullanici_adi, m.masa_numarasi
            FROM ${this.tableName} ms
            LEFT JOIN kullanicilar u ON ms.kullanici_id = u.id
            LEFT JOIN masalar m ON ms.masa_id = m.id
            WHERE ms.id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Yeni mutfak siparişi oluştur
    static async create(siparisData) {
        const {
            masa_id,
            urun_id,
            miktar,
            notlar,
            oncelik,
            kullanici_id
        } = siparisData;

        const query = `
            INSERT INTO ${this.tableName}
            (masa_id, urun_id, miktar, notlar, oncelik, kullanici_id, aktif)
            VALUES ($1, $2, $3, $4, $5, $6, 'beklemede')
            RETURNING *
        `;
        
        const result = await db.query(query, [
            masa_id,
            urun_id,
            miktar,
            notlar,
            oncelik,
            kullanici_id
        ]);

        return result.rows[0];
    }

    // mutfak siparişini güncelle
    static async update(id, siparisData) {
        const {
            masa_id,
            urun_id,
            miktar,
            notlar,
            oncelik,
            aktif
        } = siparisData;

        const query = `
            UPDATE ${this.tableName}
            SET masa_id = $1,
                urun_id = $2,
                miktar = $3,
                notlar = $4,
                oncelik = $5,
                aktif = $6,
                guncelleme_tarihi = NOW()
            WHERE id = $7
            RETURNING *
        `;

        const result = await db.query(query, [
            masa_id,
            urun_id,
            miktar,
            notlar,
            oncelik,
            aktif,
            id
        ]);

        return result.rows[0];
    }

    // mutfak siparişini sil
    static async delete(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // mutfak siparişi durumunu güncelle
    static async updateDurum(id, aktif) {
        const query = `
            UPDATE ${this.tableName}
            SET aktif = $1,
                guncelleme_tarihi = NOW()
            WHERE id = $2
            RETURNING *
        `;
        const result = await db.query(query, [aktif, id]);
        return result.rows[0];
    }

    // Bekleyen siparişleri getir
    static async getBekleyenSiparisler() {
        const query = `
            SELECT ms.*, u.ad as kullanici_adi, m.masa_numarasi
            FROM ${this.tableName} ms
            LEFT JOIN kullanicilar u ON ms.kullanici_id = u.id
            LEFT JOIN masalar m ON ms.masa_id = m.id
            WHERE ms.aktif = 'beklemede'
            ORDER BY ms.oncelik DESC, ms.olusturma_tarihi ASC
        `;
        return (await db.query(query)).rows;
    }

    // Hazırlanan siparişleri getir
    static async getHazirlananSiparisler() {
        const query = `
            SELECT ms.*, u.ad as kullanici_adi, m.masa_numarasi
            FROM ${this.tableName} ms
            LEFT JOIN kullanicilar u ON ms.kullanici_id = u.id
            LEFT JOIN masalar m ON ms.masa_id = m.id
            WHERE ms.aktif = 'hazirlaniyor'
            ORDER BY ms.olusturma_tarihi ASC
        `;
        return (await db.query(query)).rows;
    }

    // Tamamlanan siparişleri getir
    static async getTamamlananSiparisler() {
        const query = `
            SELECT ms.*, u.ad as kullanici_adi, m.masa_numarasi
            FROM ${this.tableName} ms
            LEFT JOIN kullanicilar u ON ms.kullanici_id = u.id
            LEFT JOIN masalar m ON ms.masa_id = m.id
            WHERE ms.aktif = 'tamamlandi'
            ORDER BY ms.guncelleme_tarihi DESC
        `;
        return (await db.query(query)).rows;
    }

    // Tarih aralığına göre siparişleri getir
    static async getByTarihAralik(baslangic_tarihi, bitis_tarihi) {
        const query = `
            SELECT ms.*, u.ad as kullanici_adi, m.masa_numarasi
            FROM ${this.tableName} ms
            LEFT JOIN kullanicilar u ON ms.kullanici_id = u.id
            LEFT JOIN masalar m ON ms.masa_id = m.id
            WHERE ms.olusturma_tarihi BETWEEN $1 AND $2
            ORDER BY ms.olusturma_tarihi DESC
        `;
        const result = await db.query(query, [baslangic_tarihi, bitis_tarihi]);
        return result.rows;
    }

    // aktif siparişleri getir
    static async getAktifSiparisler() {
        const query = `
            SELECT ms.*, u.ad as kullanici_adi, m.masa_numarasi
            FROM ${this.tableName} ms
            LEFT JOIN kullanicilar u ON ms.kullanici_id = u.id
            LEFT JOIN masalar m ON ms.masa_id = m.id
            WHERE ms.aktif IN ('beklemede', 'hazirlaniyor')
            ORDER BY ms.oncelik DESC, ms.olusturma_tarihi ASC
        `;
        return (await db.query(query)).rows;
    }

    // İptal edilen siparişleri getir
    static async getIptalEdilenSiparisler() {
        const query = `
            SELECT ms.*, u.ad as kullanici_adi, m.masa_numarasi
            FROM ${this.tableName} ms
            LEFT JOIN kullanicilar u ON ms.kullanici_id = u.id
            LEFT JOIN masalar m ON ms.masa_id = m.id
            WHERE ms.aktif = 'iptal'
            ORDER BY ms.guncelleme_tarihi DESC
        `;
        return (await db.query(query)).rows;
    }

    // Personele göre siparişleri getir
    static async getByPersonel(personelId, baslangic_tarihi, bitis_tarihi) {
        const query = `
            SELECT 
                ms.*,
                u.ad as kullanici_adi,
                m.masa_numarasi,
                ur.ad as urun_adi
            FROM ${this.tableName} ms
            LEFT JOIN kullanicilar u ON ms.kullanici_id = u.id
            LEFT JOIN masalar m ON ms.masa_id = m.id
            LEFT JOIN urunler ur ON ms.urun_id = ur.id
            WHERE ms.kullanici_id = $1
            ${baslangic_tarihi ? 'AND ms.olusturma_tarihi >= $2' : ''}
            ${bitis_tarihi ? 'AND ms.olusturma_tarihi <= $3' : ''}
            ORDER BY ms.olusturma_tarihi DESC
        `;

        const params = [personelId];
        if (baslangic_tarihi) params.push(baslangic_tarihi);
        if (bitis_tarihi) params.push(bitis_tarihi);

        const result = await db.query(query, params);
        return result.rows;
    }

    // Performans raporu getir
    static async getPerformansRaporu(baslangic_tarihi, bitis_tarihi) {
        const query = `
            SELECT 
                u.id as personel_id,
                u.ad as personel_adi,
                COUNT(*) as toplam_siparis,
                COUNT(CASE WHEN ms.aktif = 'tamamlandi' THEN 1 END) as tamamlanan_siparis,
                COUNT(CASE WHEN ms.aktif = 'iptal' THEN 1 END) as iptal_edilen_siparis,
                AVG(CASE 
                    WHEN ms.aktif = 'tamamlandi' 
                    THEN EXTRACT(EPOCH FROM (ms.guncelleme_tarihi - ms.olusturma_tarihi))/60 
                END)::numeric(10,2) as ortalama_hazirlama_suresi,
                MIN(CASE 
                    WHEN ms.aktif = 'tamamlandi' 
                    THEN EXTRACT(EPOCH FROM (ms.guncelleme_tarihi - ms.olusturma_tarihi))/60 
                END)::numeric(10,2) as en_hizli_hazirlama,
                MAX(CASE 
                    WHEN ms.aktif = 'tamamlandi' 
                    THEN EXTRACT(EPOCH FROM (ms.guncelleme_tarihi - ms.olusturma_tarihi))/60 
                END)::numeric(10,2) as en_yavas_hazirlama
            FROM ${this.tableName} ms
            JOIN kullanicilar u ON ms.kullanici_id = u.id
            WHERE u.rol = 'asci'
            ${baslangic_tarihi ? 'AND ms.olusturma_tarihi >= $1' : ''}
            ${bitis_tarihi ? 'AND ms.olusturma_tarihi <= $2' : ''}
            GROUP BY u.id, u.ad
            ORDER BY toplam_siparis DESC
        `;

        const params = [];
        if (baslangic_tarihi) params.push(baslangic_tarihi);
        if (bitis_tarihi) params.push(bitis_tarihi);

        const result = await db.query(query, params);
        return result.rows;
    }
}

module.exports = mutfak; 