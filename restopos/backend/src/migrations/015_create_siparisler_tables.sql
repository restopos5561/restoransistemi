-- Sipariş tipleri için ENUM oluşturma
CREATE TYPE siparis_tipi AS ENUM (
    'MASA',      -- Restoran içi masa siparişi
    'PAKET',     -- Paket servis siparişi
    'AL_GOTUR'   -- Gel-al siparişi
);

-- Sipariş durumları için ENUM oluşturma
CREATE TYPE siparis_durum AS ENUM (
    'BEKLEMEDE',     -- Yeni oluşturuldu
    'HAZIRLANIYOR',  -- Mutfakta hazırlanıyor
    'HAZIRLANDI',    -- Hazırlandı, servis bekliyor
    'TAMAMLANDI',    -- Teslim edildi/Servis edildi
    'IPTAL'          -- İptal edildi
);

-- Siparişler tablosunu oluşturma
CREATE TABLE IF NOT EXISTS siparisler (
    id SERIAL PRIMARY KEY,
    adisyon_id INTEGER NOT NULL,
    masa_id INTEGER,
    musteri_id INTEGER,
    siparis_tipi siparis_tipi NOT NULL,
    durum siparis_durum DEFAULT 'BEKLEMEDE' NOT NULL,
    toplam_tutar DECIMAL(10,2) NOT NULL DEFAULT 0,
    indirim_tutari DECIMAL(10,2) NOT NULL DEFAULT 0,
    odenecek_tutar DECIMAL(10,2) NOT NULL DEFAULT 0,
    notlar TEXT,
    garson_id INTEGER,
    hazirlayan_id INTEGER,
    teslim_eden_id INTEGER,
    teslim_tarihi TIMESTAMP WITH TIME ZONE,
    iptal_nedeni TEXT,
    iptal_eden_id INTEGER,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_adisyon
        FOREIGN KEY (adisyon_id)
        REFERENCES adisyonlar(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_masa
        FOREIGN KEY (masa_id)
        REFERENCES masalar(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_musteri
        FOREIGN KEY (musteri_id)
        REFERENCES cariler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_garson
        FOREIGN KEY (garson_id)
        REFERENCES kullanicilar(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_hazirlayan
        FOREIGN KEY (hazirlayan_id)
        REFERENCES kullanicilar(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_teslim_eden
        FOREIGN KEY (teslim_eden_id)
        REFERENCES kullanicilar(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_iptal_eden
        FOREIGN KEY (iptal_eden_id)
        REFERENCES kullanicilar(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Sipariş detayları tablosunu oluşturma
CREATE TABLE IF NOT EXISTS siparis_detaylari (
    id SERIAL PRIMARY KEY,
    siparis_id INTEGER NOT NULL,
    urun_id INTEGER NOT NULL,
    miktar DECIMAL(10,2) NOT NULL,
    birim_fiyat DECIMAL(10,2) NOT NULL,
    indirim_tutari DECIMAL(10,2) NOT NULL DEFAULT 0,
    toplam_tutar DECIMAL(10,2) NOT NULL,
    durum siparis_durum DEFAULT 'BEKLEMEDE' NOT NULL,
    notlar TEXT,
    hazirlayan_id INTEGER,
    hazirlama_suresi INTEGER, -- Dakika cinsinden
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_siparis
        FOREIGN KEY (siparis_id)
        REFERENCES siparisler(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_urun
        FOREIGN KEY (urun_id)
        REFERENCES urunler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_hazirlayan
        FOREIGN KEY (hazirlayan_id)
        REFERENCES kullanicilar(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Sipariş durum geçmişi tablosunu oluşturma
CREATE TABLE siparis_durum_gecmisi (
    id SERIAL PRIMARY KEY,
    siparis_id INTEGER NOT NULL,
    siparis_detay_id INTEGER,
    eski_durum siparis_durum,
    yeni_durum siparis_durum NOT NULL,
    aciklama TEXT,
    personel_id INTEGER,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_siparis_durum_gecmisi_siparis
        FOREIGN KEY (siparis_id)
        REFERENCES siparisler(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_siparis_durum_gecmisi_detay
        FOREIGN KEY (siparis_detay_id)
        REFERENCES siparis_detaylari(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_siparis_durum_gecmisi_personel
        FOREIGN KEY (personel_id)
        REFERENCES kullanicilar(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- İndeksler
CREATE INDEX IF NOT EXISTS siparisler_adisyon_id_idx ON siparisler(adisyon_id);
CREATE INDEX IF NOT EXISTS siparisler_masa_id_idx ON siparisler(masa_id);
CREATE INDEX IF NOT EXISTS siparisler_musteri_id_idx ON siparisler(musteri_id);
CREATE INDEX IF NOT EXISTS siparisler_garson_id_idx ON siparisler(garson_id);
CREATE INDEX IF NOT EXISTS siparisler_durum_idx ON siparisler(durum);
CREATE INDEX IF NOT EXISTS siparisler_siparis_tipi_idx ON siparisler(siparis_tipi);
CREATE INDEX IF NOT EXISTS siparisler_olusturma_tarihi_idx ON siparisler(olusturma_tarihi);

CREATE INDEX IF NOT EXISTS siparis_detaylari_siparis_id_idx ON siparis_detaylari(siparis_id);
CREATE INDEX IF NOT EXISTS siparis_detaylari_urun_id_idx ON siparis_detaylari(urun_id);
CREATE INDEX IF NOT EXISTS siparis_detaylari_durum_idx ON siparis_detaylari(durum);
CREATE INDEX IF NOT EXISTS siparis_detaylari_hazirlayan_id_idx ON siparis_detaylari(hazirlayan_id);

CREATE INDEX siparis_durum_gecmisi_siparis_id_idx ON siparis_durum_gecmisi(siparis_id);
CREATE INDEX siparis_durum_gecmisi_siparis_detay_id_idx ON siparis_durum_gecmisi(siparis_detay_id);

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_siparis_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Sipariş tutarlarını güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_siparis_tutarlari()
RETURNS TRIGGER AS $$
BEGIN
    -- Sipariş detayı eklendiğinde/güncellendiğinde/silindiğinde sipariş tutarlarını güncelle
    WITH siparis_toplam AS (
        SELECT
            siparis_id,
            SUM(toplam_tutar) as toplam,
            SUM(indirim_tutari) as indirim
        FROM siparis_detaylari
        WHERE siparis_id = COALESCE(NEW.siparis_id, OLD.siparis_id)
        GROUP BY siparis_id
    )
    UPDATE siparisler s
    SET
        toplam_tutar = COALESCE(st.toplam, 0),
        indirim_tutari = COALESCE(st.indirim, 0),
        odenecek_tutar = COALESCE(st.toplam - st.indirim, 0),
        guncelleme_tarihi = NOW()
    FROM siparis_toplam st
    WHERE s.id = st.siparis_id;

    RETURN NULL;
END;
$$ language 'plpgsql';

-- Durum değişikliği loglama fonksiyonu
CREATE OR REPLACE FUNCTION log_siparis_durum_degisikligi()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (OLD.durum IS DISTINCT FROM NEW.durum) THEN
        INSERT INTO siparis_durum_gecmisi (
            siparis_id,
            eski_durum,
            yeni_durum,
            aciklama,
            personel_id
        ) VALUES (
            NEW.id,
            CASE WHEN TG_OP = 'UPDATE' THEN OLD.durum ELSE NULL END,
            NEW.durum,
            'Durum güncellendi',
            NULL
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Sipariş detayı durum değişikliği loglama fonksiyonu
CREATE OR REPLACE FUNCTION log_siparis_detay_durum_degisikligi()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (OLD.durum IS DISTINCT FROM NEW.durum) THEN
        INSERT INTO siparis_durum_gecmisi (
            siparis_id,
            siparis_detay_id,
            eski_durum,
            yeni_durum,
            aciklama,
            personel_id
        ) VALUES (
            NEW.siparis_id,
            NEW.id,
            CASE WHEN TG_OP = 'UPDATE' THEN OLD.durum ELSE NULL END,
            NEW.durum,
            'Ürün durumu güncellendi',
            NULL
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'lar
DROP TRIGGER IF EXISTS update_siparisler_guncelleme_tarihi ON siparisler;
CREATE TRIGGER update_siparisler_guncelleme_tarihi
    BEFORE UPDATE ON siparisler
    FOR EACH ROW
    EXECUTE FUNCTION update_siparis_guncelleme_tarihi();

DROP TRIGGER IF EXISTS update_siparis_detaylari_guncelleme_tarihi ON siparis_detaylari;
CREATE TRIGGER update_siparis_detaylari_guncelleme_tarihi
    BEFORE UPDATE ON siparis_detaylari
    FOR EACH ROW
    EXECUTE FUNCTION update_siparis_guncelleme_tarihi();

DROP TRIGGER IF EXISTS update_siparis_tutarlari_trigger ON siparis_detaylari;
CREATE TRIGGER update_siparis_tutarlari_trigger
    AFTER INSERT OR UPDATE OR DELETE ON siparis_detaylari
    FOR EACH ROW
    EXECUTE FUNCTION update_siparis_tutarlari();

DROP TRIGGER IF EXISTS log_siparis_durum_degisikligi_trigger ON siparisler;
CREATE TRIGGER log_siparis_durum_degisikligi_trigger
    AFTER INSERT OR UPDATE ON siparisler
    FOR EACH ROW
    EXECUTE FUNCTION log_siparis_durum_degisikligi();

DROP TRIGGER IF EXISTS log_siparis_detay_durum_degisikligi_trigger ON siparis_detaylari;
CREATE TRIGGER log_siparis_detay_durum_degisikligi_trigger
    AFTER INSERT OR UPDATE ON siparis_detaylari
    FOR EACH ROW
    EXECUTE FUNCTION log_siparis_detay_durum_degisikligi();