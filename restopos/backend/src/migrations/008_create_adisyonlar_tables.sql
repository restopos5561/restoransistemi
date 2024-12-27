-- Adisyon durumları için ENUM oluşturma
CREATE TYPE adisyon_durum AS ENUM ('Acik', 'Kapali', 'Iptal');

-- Ödeme tipleri için ENUM oluşturma
CREATE TYPE odeme_tipi AS ENUM ('Nakit', 'Kredi Kartı', 'Yemek Çeki', 'Havale/EFT', 'Diğer');

-- Adisyonlar tablosunu oluşturma
CREATE TABLE adisyonlar (
    id SERIAL PRIMARY KEY,
    masa_id INTEGER,
    cari_id INTEGER,
    acilis_zamani TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    kapanis_zamani TIMESTAMP WITH TIME ZONE,
    toplam_tutar DECIMAL(12,2) DEFAULT 0 NOT NULL,
    indirim_tutari DECIMAL(12,2) DEFAULT 0 NOT NULL,
    odenen_tutar DECIMAL(12,2) DEFAULT 0 NOT NULL,
    odeme_tipi odeme_tipi,
    durum adisyon_durum DEFAULT 'Acik' NOT NULL,
    personel_id INTEGER,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_masa
        FOREIGN KEY (masa_id)
        REFERENCES masalar(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_cari
        FOREIGN KEY (cari_id)
        REFERENCES cariler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_personel
        FOREIGN KEY (personel_id)
        REFERENCES cariler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT check_tutarlar
        CHECK (
            toplam_tutar >= indirim_tutari AND
            odenen_tutar <= (toplam_tutar - indirim_tutari)
        )
);

-- Personel ve müşteri tiplerini kontrol eden fonksiyon
CREATE OR REPLACE FUNCTION check_adisyon_references()
RETURNS TRIGGER AS $$
BEGIN
    -- Personel tipi kontrolü
    IF NEW.personel_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM cariler
            WHERE id = NEW.personel_id AND cari_tipi = 'Personel'
        ) THEN
            RAISE EXCEPTION 'Personel ID geçersiz. Sadece personel tipindeki cariler kullanılabilir.';
        END IF;
    END IF;

    -- Cari tipi kontrolü
    IF NEW.cari_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM cariler
            WHERE id = NEW.cari_id AND cari_tipi IN ('Müşteri', 'Uye')
        ) THEN
            RAISE EXCEPTION 'Cari ID geçersiz. Sadece müşteri veya üye tipindeki cariler kullanılabilir.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Personel ve müşteri tipi kontrolü için trigger
CREATE TRIGGER check_adisyon_references_trigger
    BEFORE INSERT OR UPDATE OF personel_id, cari_id
    ON adisyonlar
    FOR EACH ROW
    EXECUTE FUNCTION check_adisyon_references();

-- Adisyon kalemleri tablosunu oluşturma
CREATE TABLE adisyon_kalemleri (
    id SERIAL PRIMARY KEY,
    adisyon_id INTEGER NOT NULL,
    urun_id INTEGER NOT NULL,
    adet DECIMAL(10,3) NOT NULL CHECK (adet > 0),
    birim_fiyat DECIMAL(10,2) NOT NULL CHECK (birim_fiyat >= 0),
    toplam_fiyat DECIMAL(12,2) NOT NULL CHECK (toplam_fiyat >= 0),
    indirim_tutari DECIMAL(10,2) DEFAULT 0 NOT NULL CHECK (indirim_tutari >= 0),
    aciklama TEXT,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_adisyon
        FOREIGN KEY (adisyon_id)
        REFERENCES adisyonlar(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_urun
        FOREIGN KEY (urun_id)
        REFERENCES urunler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT check_toplam_fiyat
        CHECK (toplam_fiyat = adet * birim_fiyat - indirim_tutari)
);

-- Ödemeler tablosunu oluşturma
CREATE TABLE odemeler (
    id SERIAL PRIMARY KEY,
    adisyon_id INTEGER NOT NULL,
    tutar DECIMAL(12,2) NOT NULL CHECK (tutar > 0),
    odeme_tipi odeme_tipi NOT NULL,
    referans_no VARCHAR(50),
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_adisyon
        FOREIGN KEY (adisyon_id)
        REFERENCES adisyonlar(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- İndeksler
CREATE INDEX adisyonlar_masa_id_idx ON adisyonlar(masa_id);
CREATE INDEX adisyonlar_cari_id_idx ON adisyonlar(cari_id);
CREATE INDEX adisyonlar_personel_id_idx ON adisyonlar(personel_id);
CREATE INDEX adisyonlar_durum_idx ON adisyonlar(durum);
CREATE INDEX adisyonlar_tarih_idx ON adisyonlar(olusturma_tarihi);

CREATE INDEX adisyon_kalemleri_adisyon_id_idx ON adisyon_kalemleri(adisyon_id);
CREATE INDEX adisyon_kalemleri_urun_id_idx ON adisyon_kalemleri(urun_id);
CREATE INDEX adisyon_kalemleri_tarih_idx ON adisyon_kalemleri(olusturma_tarihi);

CREATE INDEX odemeler_adisyon_id_idx ON odemeler(adisyon_id);
CREATE INDEX odemeler_tarih_idx ON odemeler(olusturma_tarihi);

-- Trigger'lar
-- Adisyon kalemlerindeki toplam tutarı güncelleme
CREATE OR REPLACE FUNCTION update_adisyon_tutarlar()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE adisyonlar
    SET toplam_tutar = (
        SELECT COALESCE(SUM(toplam_fiyat), 0)
        FROM adisyon_kalemleri
        WHERE adisyon_id = NEW.adisyon_id
    )
    WHERE id = NEW.adisyon_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_adisyon_tutarlar_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON adisyon_kalemleri
    FOR EACH ROW
    EXECUTE FUNCTION update_adisyon_tutarlar();

-- Ödeme eklendiğinde adisyon tutarını güncelleme
CREATE OR REPLACE FUNCTION update_adisyon_odenen_tutar()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE adisyonlar
    SET odenen_tutar = (
        SELECT COALESCE(SUM(tutar), 0)
        FROM odemeler
        WHERE adisyon_id = NEW.adisyon_id
    )
    WHERE id = NEW.adisyon_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_adisyon_odenen_tutar_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON odemeler
    FOR EACH ROW
    EXECUTE FUNCTION update_adisyon_odenen_tutar();

-- Adisyon kapandığında masa durumunu güncelleme
CREATE OR REPLACE FUNCTION update_masa_durum_after_adisyon()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.durum = 'Kapali' AND OLD.durum = 'Acik' AND NEW.masa_id IS NOT NULL THEN
        -- Masada başka aktif adisyon var mı kontrol et
        IF NOT EXISTS (
            SELECT 1 FROM adisyonlar
            WHERE masa_id = NEW.masa_id
            AND durum = 'Acik'
            AND id != NEW.id
        ) THEN
            UPDATE masalar
            SET durum = 'Boş'
            WHERE id = NEW.masa_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_masa_durum_after_adisyon_trigger
    AFTER UPDATE OF durum
    ON adisyonlar
    FOR EACH ROW
    EXECUTE FUNCTION update_masa_durum_after_adisyon(); 