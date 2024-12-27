-- Bölgeler tablosunu oluştur
CREATE TABLE IF NOT EXISTS bolgeler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT,
    aktif BOOLEAN DEFAULT true,
    sira INTEGER DEFAULT 0,
    olusturma_tarihi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bölgeler tablosu için index
CREATE INDEX IF NOT EXISTS idx_bolgeler_ad ON bolgeler(ad);
CREATE INDEX IF NOT EXISTS idx_bolgeler_aktif ON bolgeler(aktif);
CREATE INDEX IF NOT EXISTS idx_bolgeler_sira ON bolgeler(sira);

-- Masalar tablosuna bolge_id foreign key ekle
ALTER TABLE masalar 
ADD COLUMN IF NOT EXISTS bolge_id INTEGER REFERENCES bolgeler(id) ON DELETE SET NULL;

-- Trigger for guncelleme_tarihi
CREATE OR REPLACE FUNCTION update_bolgeler_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_bolgeler_guncelleme_tarihi
    BEFORE UPDATE
    ON bolgeler
    FOR EACH ROW
EXECUTE FUNCTION update_bolgeler_guncelleme_tarihi(); 