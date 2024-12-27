-- Ürün birimleri için ENUM tipi oluşturma
CREATE TYPE urun_birim AS ENUM ('Adet', 'Porsiyon', 'Bardak', 'Gram', 'Kilogram', 'Litre', 'Mililitre');

-- Ürünler tablosunu oluşturma
CREATE TABLE urunler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT,
    fiyat DECIMAL(10,2) NOT NULL CHECK (fiyat >= 0),
    kategori_id INTEGER NOT NULL,
    barkod VARCHAR(50) UNIQUE,
    birim urun_birim DEFAULT 'Adet' NOT NULL,
    resim_url TEXT,
    aktif BOOLEAN DEFAULT true NOT NULL,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_kategori
        FOREIGN KEY (kategori_id)
        REFERENCES urun_kategorileri(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Ürün adı için tekil indeks
CREATE UNIQUE INDEX urunler_ad_idx ON urunler(ad) WHERE aktif = true;

-- Kategori ID için indeks
CREATE INDEX urunler_kategori_id_idx ON urunler(kategori_id);

-- Barkod için indeks
CREATE INDEX urunler_barkod_idx ON urunler(barkod);

-- Aktif ürünler için indeks
CREATE INDEX urunler_aktif_idx ON urunler(aktif);

-- Trigger fonksiyonu oluşturma (guncelleme_tarihi otomatik güncelleme için)
CREATE OR REPLACE FUNCTION update_urun_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma
CREATE TRIGGER update_urunler_guncelleme_tarihi
    BEFORE UPDATE
    ON urunler
    FOR EACH ROW
    EXECUTE FUNCTION update_urun_guncelleme_tarihi();

-- Fiyat değişikliği kontrolü için trigger
CREATE OR REPLACE FUNCTION check_fiyat_degisikligi()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fiyat < OLD.fiyat THEN
        -- Fiyat düşüşünde uyarı logu oluştur
        INSERT INTO fiyat_degisiklik_log (
            urun_id,
            eski_fiyat,
            yeni_fiyat,
            degisiklik_tarihi
        ) VALUES (
            NEW.id,
            OLD.fiyat,
            NEW.fiyat,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fiyat değişikliği için trigger oluşturma
CREATE TRIGGER check_urun_fiyat_degisikligi
    BEFORE UPDATE OF fiyat
    ON urunler
    FOR EACH ROW
    EXECUTE FUNCTION check_fiyat_degisikligi(); 