-- Lisanslar tablosunu oluştur
CREATE TABLE IF NOT EXISTS lisanslar (
    id SERIAL PRIMARY KEY,
    lisans_kodu VARCHAR(100) NOT NULL UNIQUE,
    baslangic_tarihi TIMESTAMP NOT NULL,
    bitis_tarihi TIMESTAMP NOT NULL,
    firma_adi VARCHAR(200) NOT NULL,
    firma_yetkili VARCHAR(100),
    firma_telefon VARCHAR(20),
    firma_email VARCHAR(100),
    firma_adres TEXT,
    modul_listesi JSONB,
    kullanici_limiti INTEGER DEFAULT 0,
    masa_limiti INTEGER DEFAULT 0,
    durum BOOLEAN DEFAULT true,
    notlar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndexler
CREATE INDEX IF NOT EXISTS idx_lisanslar_lisans_kodu ON lisanslar(lisans_kodu);
CREATE INDEX IF NOT EXISTS idx_lisanslar_firma_adi ON lisanslar(firma_adi);
CREATE INDEX IF NOT EXISTS idx_lisanslar_durum ON lisanslar(durum);
CREATE INDEX IF NOT EXISTS idx_lisanslar_bitis_tarihi ON lisanslar(bitis_tarihi);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_lisanslar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lisanslar_updated_at
    BEFORE UPDATE
    ON lisanslar
    FOR EACH ROW
EXECUTE FUNCTION update_lisanslar_updated_at(); 