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

-- Varsayılan rolleri ekle
INSERT INTO roller (ad, aciklama) VALUES
    ('admin', 'Sistem yöneticisi'),
    ('mudur', 'Restoran müdürü'),
    ('garson', 'Garson'),
    ('kasiyer', 'Kasiyer'),
    ('asci', 'Aşçı')
ON CONFLICT (ad) DO NOTHING;

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS kullanicilar (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    sifre VARCHAR(255) NOT NULL,
    ad VARCHAR(100) NOT NULL,
    soyad VARCHAR(100) NOT NULL,
    rol_id INTEGER REFERENCES roller(id),
    aktif BOOLEAN DEFAULT true,
    son_giris_tarihi TIMESTAMP,
    olusturma_tarihi TIMESTAMP DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP DEFAULT NOW()
);

-- Kullanıcılar tablosu için güncelleme tarihi trigger'ı
CREATE OR REPLACE FUNCTION update_kullanicilar_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_kullanicilar_guncelleme_tarihi
    BEFORE UPDATE ON kullanicilar
    FOR EACH ROW
    EXECUTE FUNCTION update_kullanicilar_guncelleme_tarihi();

-- Varsayılan admin kullanıcısını ekle
-- Şifre: admin123 (bcrypt ile hashlenmiş hali)
INSERT INTO kullanicilar (email, sifre, ad, soyad, rol_id)
SELECT 'admin@restopos.com', '$2b$10$3sC7C/xv.cHWh5jM0RvO8O1d6avE0GDT9EH1nwQD5osUGZx3bhqRK', 'Admin', 'User', r.id
FROM roller r
WHERE r.ad = 'admin'
ON CONFLICT (email) DO NOTHING; 