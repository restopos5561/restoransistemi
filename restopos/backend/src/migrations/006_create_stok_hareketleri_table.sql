-- Stok hareket tipleri için ENUM oluşturma
CREATE TYPE stok_hareket_tipi AS ENUM ('Giriş', 'Çıkış');

-- Stok hareket kaynakları için ENUM oluşturma
CREATE TYPE stok_hareket_kaynak AS ENUM (
    'Satış',
    'Stok Girişi',
    'İptal',
    'Fire',
    'Sayım Düzeltme',
    'Transfer'
);

-- Stok hareketleri tablosunu oluşturma
CREATE TABLE stok_hareketleri (
    id SERIAL PRIMARY KEY,
    urun_id INTEGER NOT NULL,
    hareket_tipi stok_hareket_tipi NOT NULL,
    miktar DECIMAL(10,2) NOT NULL CHECK (miktar > 0),
    birim urun_birim NOT NULL,
    kaynak stok_hareket_kaynak NOT NULL,
    referans_id INTEGER,
    aciklama TEXT,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_urun
        FOREIGN KEY (urun_id)
        REFERENCES urunler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Ürün ID için indeks
CREATE INDEX stok_hareketleri_urun_id_idx ON stok_hareketleri(urun_id);

-- Hareket tipi için indeks
CREATE INDEX stok_hareketleri_hareket_tipi_idx ON stok_hareketleri(hareket_tipi);

-- Kaynak için indeks
CREATE INDEX stok_hareketleri_kaynak_idx ON stok_hareketleri(kaynak);

-- Referans ID için indeks
CREATE INDEX stok_hareketleri_referans_id_idx ON stok_hareketleri(referans_id) 
WHERE referans_id IS NOT NULL;

-- Tarih için indeks
CREATE INDEX stok_hareketleri_tarih_idx ON stok_hareketleri(olusturma_tarihi);

-- Stok miktarını otomatik güncelleme için trigger
CREATE OR REPLACE FUNCTION update_stok_after_hareket()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.hareket_tipi = 'Giriş' THEN
        UPDATE stoklar
        SET mevcut_miktar = mevcut_miktar + NEW.miktar
        WHERE urun_id = NEW.urun_id;
    ELSIF NEW.hareket_tipi = 'Çıkış' THEN
        -- Stok yeterliliğini kontrol et
        IF NOT EXISTS (
            SELECT 1 FROM stoklar
            WHERE urun_id = NEW.urun_id
            AND mevcut_miktar >= NEW.miktar
        ) THEN
            RAISE EXCEPTION 'Yetersiz stok miktarı';
        END IF;
        
        UPDATE stoklar
        SET mevcut_miktar = mevcut_miktar - NEW.miktar
        WHERE urun_id = NEW.urun_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma
CREATE TRIGGER update_stok_after_hareket_trigger
    AFTER INSERT
    ON stok_hareketleri
    FOR EACH ROW
    EXECUTE FUNCTION update_stok_after_hareket(); 