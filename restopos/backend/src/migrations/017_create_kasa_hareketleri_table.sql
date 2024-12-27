-- Kasa hareketleri tablosunu oluştur
CREATE TABLE kasa_hareketleri (
    id SERIAL PRIMARY KEY,
    islem_tipi VARCHAR(50) NOT NULL CHECK (islem_tipi IN ('giris', 'cikis')),
    tutar DECIMAL(10,2) NOT NULL,
    aciklama TEXT NOT NULL,
    belge_no VARCHAR(100),
    odeme_yontemi VARCHAR(50) NOT NULL,
    kullanici_id INTEGER NOT NULL REFERENCES kullanicilar(id) ON DELETE RESTRICT,
    durum VARCHAR(50) NOT NULL DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'onaylandi', 'reddedildi')),
    durum_aciklama TEXT,
    tarih TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    olusturma_tarihi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Kasa hareketleri için indeksler
CREATE INDEX idx_kasa_hareketleri_islem_tipi ON kasa_hareketleri(islem_tipi);
CREATE INDEX idx_kasa_hareketleri_durum ON kasa_hareketleri(durum);
CREATE INDEX idx_kasa_hareketleri_tarih ON kasa_hareketleri(tarih);
CREATE INDEX idx_kasa_hareketleri_odeme_yontemi ON kasa_hareketleri(odeme_yontemi);
CREATE INDEX idx_kasa_hareketleri_kullanici_id ON kasa_hareketleri(kullanici_id);

-- Güncelleme tarihi için trigger
CREATE OR REPLACE FUNCTION update_kasa_hareketleri_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_kasa_hareketleri_guncelleme_tarihi
    BEFORE UPDATE ON kasa_hareketleri
    FOR EACH ROW
    EXECUTE FUNCTION update_kasa_hareketleri_guncelleme_tarihi(); 