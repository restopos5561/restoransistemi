-- Ayarlar tablosunu oluştur
CREATE TABLE IF NOT EXISTS ayarlar (
    id SERIAL PRIMARY KEY,
    restoran_adi VARCHAR(255) NOT NULL,
    adres TEXT,
    telefon VARCHAR(20),
    vergi_no VARCHAR(20),
    vergi_dairesi VARCHAR(100),
    logo_url TEXT,
    tema VARCHAR(50) DEFAULT 'light',
    dil VARCHAR(10) DEFAULT 'tr',
    para_birimi VARCHAR(10) DEFAULT 'TRY',
    kdv_orani DECIMAL DEFAULT 18,
    servis_bedeli_orani DECIMAL DEFAULT 0,
    min_stok_uyari_seviyesi INTEGER DEFAULT 10,
    yazici_ayarlari JSONB DEFAULT '{}',
    email_ayarlari JSONB DEFAULT '{}',
    sms_ayarlari JSONB DEFAULT '{}',
    olusturma_tarihi TIMESTAMP DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP DEFAULT NOW()
);

-- Lisans tablosunu oluştur
CREATE TABLE IF NOT EXISTS lisans (
    id SERIAL PRIMARY KEY,
    lisans_anahtari VARCHAR(255) NOT NULL,
    musteri_adi VARCHAR(255) NOT NULL,
    baslangic_tarihi TIMESTAMP NOT NULL,
    bitis_tarihi TIMESTAMP NOT NULL,
    ozellikler TEXT[] DEFAULT '{}',
    olusturma_tarihi TIMESTAMP DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP DEFAULT NOW()
);

-- Varsayılan ayarları ekle
INSERT INTO ayarlar (
    restoran_adi,
    adres,
    telefon,
    vergi_no,
    vergi_dairesi,
    tema,
    dil,
    para_birimi,
    kdv_orani,
    servis_bedeli_orani,
    min_stok_uyari_seviyesi,
    yazici_ayarlari,
    email_ayarlari,
    sms_ayarlari
) VALUES (
    'Restoran Adı',
    'Restoran Adresi',
    '0212 123 45 67',
    '1234567890',
    'Vergi Dairesi',
    'light',
    'tr',
    'TRY',
    18,
    0,
    10,
    '{}',
    '{}',
    '{}'
) ON CONFLICT (id) DO NOTHING;

-- Varsayılan lisans bilgilerini ekle
INSERT INTO lisans (
    lisans_anahtari,
    musteri_adi,
    baslangic_tarihi,
    bitis_tarihi,
    ozellikler
) VALUES (
    'DEMO-LICENSE',
    'Demo Müşteri',
    NOW(),
    NOW() + INTERVAL '30 days',
    ARRAY['temel_ozellikler']
) ON CONFLICT (id) DO NOTHING;

-- Trigger fonksiyonunu oluştur
CREATE OR REPLACE FUNCTION update_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ayarlar tablosu için trigger oluştur
DROP TRIGGER IF EXISTS update_ayarlar_guncelleme_tarihi ON ayarlar;
CREATE TRIGGER update_ayarlar_guncelleme_tarihi
    BEFORE UPDATE ON ayarlar
    FOR EACH ROW
    EXECUTE FUNCTION update_guncelleme_tarihi();

-- Lisans tablosu için trigger oluştur
DROP TRIGGER IF EXISTS update_lisans_guncelleme_tarihi ON lisans;
CREATE TRIGGER update_lisans_guncelleme_tarihi
    BEFORE UPDATE ON lisans
    FOR EACH ROW
    EXECUTE FUNCTION update_guncelleme_tarihi(); 