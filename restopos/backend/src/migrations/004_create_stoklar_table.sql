-- Stok birimleri için ENUM tipi oluşturma (urun_birim ile aynı)
-- CREATE TYPE stok_birim AS ENUM ('Adet', 'Porsiyon', 'Bardak', 'Gram', 'Kilogram', 'Litre', 'Mililitre');
-- Zaten urun_birim ENUM'u var, onu kullanacağız

-- Stoklar tablosunu oluşturma
CREATE TABLE stoklar (
    id SERIAL PRIMARY KEY,
    urun_id INTEGER NOT NULL UNIQUE,
    mevcut_miktar DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (mevcut_miktar >= 0),
    birim urun_birim NOT NULL,
    kritik_stok_seviyesi DECIMAL(10,2),
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_urun
        FOREIGN KEY (urun_id)
        REFERENCES urunler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Ürün ID için indeks (zaten UNIQUE constraint ile oluşturuldu)
CREATE INDEX stoklar_urun_id_idx ON stoklar(urun_id);

-- Kritik stok seviyesi için indeks
CREATE INDEX stoklar_kritik_stok_idx ON stoklar(kritik_stok_seviyesi) 
WHERE kritik_stok_seviyesi IS NOT NULL;

-- Trigger fonksiyonu oluşturma (guncelleme_tarihi otomatik güncelleme için)
CREATE OR REPLACE FUNCTION update_stok_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma
CREATE TRIGGER update_stoklar_guncelleme_tarihi
    BEFORE UPDATE
    ON stoklar
    FOR EACH ROW
    EXECUTE FUNCTION update_stok_guncelleme_tarihi();

-- Stok miktarı kontrolü için trigger
CREATE OR REPLACE FUNCTION check_stok_miktar()
RETURNS TRIGGER AS $$
BEGIN
    -- Stok miktarı negatif olamaz
    IF NEW.mevcut_miktar < 0 THEN
        RAISE EXCEPTION 'Stok miktarı negatif olamaz';
    END IF;

    -- Kritik stok seviyesi kontrolü
    IF NEW.kritik_stok_seviyesi IS NOT NULL AND NEW.mevcut_miktar <= NEW.kritik_stok_seviyesi THEN
        -- Kritik stok uyarısı oluştur
        INSERT INTO stok_uyarilari (
            stok_id,
            urun_id,
            miktar,
            kritik_seviye,
            uyari_mesaji
        ) VALUES (
            NEW.id,
            NEW.urun_id,
            NEW.mevcut_miktar,
            NEW.kritik_stok_seviyesi,
            'Ürün kritik stok seviyesinin altına düştü'
        );
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Stok miktarı kontrolü için trigger oluşturma
CREATE TRIGGER check_stok_miktar_trigger
    BEFORE INSERT OR UPDATE OF mevcut_miktar
    ON stoklar
    FOR EACH ROW
    EXECUTE FUNCTION check_stok_miktar();

-- Yeni ürün eklendiğinde otomatik stok kaydı oluşturma için trigger
CREATE OR REPLACE FUNCTION create_stok_for_new_urun()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO stoklar (urun_id, birim)
    VALUES (NEW.id, NEW.birim);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Yeni ürün trigger'ı oluşturma
CREATE TRIGGER create_stok_after_urun_insert
    AFTER INSERT
    ON urunler
    FOR EACH ROW
    EXECUTE FUNCTION create_stok_for_new_urun(); 