-- Hızlı satış tablosunu oluştur
CREATE TABLE hizli_satislar (
    id SERIAL PRIMARY KEY,
    kategori_id INTEGER NOT NULL REFERENCES urun_kategorileri(id) ON DELETE RESTRICT,
    urun_id INTEGER NOT NULL REFERENCES urunler(id) ON DELETE RESTRICT,
    miktar INTEGER NOT NULL,
    tutar DECIMAL(10,2) NOT NULL,
    odeme_tipi VARCHAR(50) NOT NULL,
    kullanici_id INTEGER NOT NULL REFERENCES kullanicilar(id) ON DELETE RESTRICT,
    aciklama TEXT,
    durum VARCHAR(50) NOT NULL DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'hazirlaniyor', 'tamamlandi', 'iptal')),
    sira INTEGER NOT NULL DEFAULT 0,
    tarih TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    olusturma_tarihi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- İndirimler tablosunu oluştur
CREATE TABLE indirimler (
    id SERIAL PRIMARY KEY,
    hizli_satis_id INTEGER NOT NULL REFERENCES hizli_satislar(id) ON DELETE CASCADE,
    indirim_tipi VARCHAR(50) NOT NULL CHECK (indirim_tipi IN ('yuzde', 'tutar')),
    tutar DECIMAL(10,2) NOT NULL,
    aciklama TEXT NOT NULL,
    kullanici_id INTEGER NOT NULL REFERENCES kullanicilar(id) ON DELETE RESTRICT,
    olusturma_tarihi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- İkramlar tablosunu oluştur
CREATE TABLE ikramlar (
    id SERIAL PRIMARY KEY,
    hizli_satis_id INTEGER NOT NULL REFERENCES hizli_satislar(id) ON DELETE CASCADE,
    urun_id INTEGER NOT NULL REFERENCES urunler(id) ON DELETE RESTRICT,
    miktar INTEGER NOT NULL,
    aciklama TEXT NOT NULL,
    kullanici_id INTEGER NOT NULL REFERENCES kullanicilar(id) ON DELETE RESTRICT,
    olusturma_tarihi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_hizli_satislar_kategori_id ON hizli_satislar(kategori_id);
CREATE INDEX idx_hizli_satislar_urun_id ON hizli_satislar(urun_id);
CREATE INDEX idx_hizli_satislar_odeme_tipi ON hizli_satislar(odeme_tipi);
CREATE INDEX idx_hizli_satislar_kullanici_id ON hizli_satislar(kullanici_id);
CREATE INDEX idx_hizli_satislar_durum ON hizli_satislar(durum);
CREATE INDEX idx_hizli_satislar_tarih ON hizli_satislar(tarih);
CREATE INDEX idx_hizli_satislar_sira ON hizli_satislar(sira);

CREATE INDEX idx_indirimler_hizli_satis_id ON indirimler(hizli_satis_id);
CREATE INDEX idx_indirimler_kullanici_id ON indirimler(kullanici_id);

CREATE INDEX idx_ikramlar_hizli_satis_id ON ikramlar(hizli_satis_id);
CREATE INDEX idx_ikramlar_urun_id ON ikramlar(urun_id);
CREATE INDEX idx_ikramlar_kullanici_id ON ikramlar(kullanici_id);

-- Güncelleme tarihi için trigger
CREATE OR REPLACE FUNCTION update_hizli_satis_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hizli_satis_guncelleme_tarihi
    BEFORE UPDATE ON hizli_satislar
    FOR EACH ROW
    EXECUTE FUNCTION update_hizli_satis_guncelleme_tarihi(); 