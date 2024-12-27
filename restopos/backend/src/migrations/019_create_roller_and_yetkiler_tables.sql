-- Yetkiler tablosu
CREATE TABLE IF NOT EXISTS yetkiler (
    id SERIAL PRIMARY KEY,
    kod VARCHAR(50) NOT NULL UNIQUE,
    aciklama TEXT,
    olusturma_tarihi TIMESTAMP DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP DEFAULT NOW()
);

-- Yetkiler tablosu için güncelleme tarihi trigger'ı
CREATE OR REPLACE FUNCTION update_yetkiler_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_yetkiler_guncelleme_tarihi
    BEFORE UPDATE ON yetkiler
    FOR EACH ROW
    EXECUTE FUNCTION update_yetkiler_guncelleme_tarihi();

-- Roller tablosu
CREATE TABLE IF NOT EXISTS roller (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(50) NOT NULL UNIQUE,
    aciklama TEXT,
    olusturma_tarihi TIMESTAMP DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP DEFAULT NOW()
);

-- Roller tablosu için güncelleme tarihi trigger'ı
CREATE OR REPLACE FUNCTION update_roller_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_roller_guncelleme_tarihi
    BEFORE UPDATE ON roller
    FOR EACH ROW
    EXECUTE FUNCTION update_roller_guncelleme_tarihi();

-- Rol-Yetki ilişki tablosu
CREATE TABLE IF NOT EXISTS rol_yetkiler (
    id SERIAL PRIMARY KEY,
    rol_id INTEGER REFERENCES roller(id) ON DELETE CASCADE,
    yetki_id INTEGER REFERENCES yetkiler(id) ON DELETE CASCADE,
    olusturma_tarihi TIMESTAMP DEFAULT NOW(),
    UNIQUE(rol_id, yetki_id)
);

-- Varsayılan yetkiler
INSERT INTO yetkiler (kod, aciklama) VALUES
    ('KULLANICI_YONETIMI', 'Kullanıcı yönetimi yetkileri'),
    ('SIPARIS_YONETIMI', 'Sipariş yönetimi yetkileri'),
    ('STOK_YONETIMI', 'Stok yönetimi yetkileri'),
    ('RAPOR_GORUNTULEME', 'Rapor görüntüleme yetkileri'),
    ('AYARLAR_YONETIMI', 'Sistem ayarları yönetimi yetkileri')
ON CONFLICT (kod) DO NOTHING;

-- Varsayılan roller
INSERT INTO roller (ad, aciklama) VALUES
    ('admin', 'Sistem yöneticisi'),
    ('mudur', 'Restoran müdürü'),
    ('garson', 'Garson'),
    ('kasiyer', 'Kasiyer'),
    ('asci', 'Aşçı')
ON CONFLICT (ad) DO NOTHING;

-- Varsayılan rol-yetki ilişkileri
INSERT INTO rol_yetkiler (rol_id, yetki_id)
SELECT r.id, y.id
FROM roller r
CROSS JOIN yetkiler y
WHERE r.ad = 'admin'
ON CONFLICT DO NOTHING; 