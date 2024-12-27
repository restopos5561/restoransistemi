-- Ürün kategorileri tablosunu oluşturma
CREATE TABLE urun_kategorileri (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL UNIQUE,
    aciklama TEXT,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kategori adı için indeks (zaten UNIQUE constraint ile oluşturuldu)
CREATE INDEX urun_kategorileri_ad_idx ON urun_kategorileri(ad);

-- Trigger fonksiyonu oluşturma (guncelleme_tarihi otomatik güncelleme için)
CREATE OR REPLACE FUNCTION update_kategori_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma
CREATE TRIGGER update_urun_kategorileri_guncelleme_tarihi
    BEFORE UPDATE
    ON urun_kategorileri
    FOR EACH ROW
    EXECUTE FUNCTION update_kategori_guncelleme_tarihi();

-- Temel kategorileri ekleme
INSERT INTO urun_kategorileri (ad, aciklama) VALUES
    ('Yiyecekler', 'Ana yemekler, mezeler ve diğer yiyecek ürünleri'),
    ('İçecekler', 'Sıcak ve soğuk içecekler'),
    ('Tatlılar', 'Tatlılar ve pastalar'),
    ('Başlangıçlar', 'Çorbalar ve başlangıç yemekleri'),
    ('Mezeler', 'Soğuk ve sıcak mezeler'),
    ('Salatalar', 'Taze salatalar'),
    ('Alkolsüz İçecekler', 'Meşrubat, meyve suları ve diğer alkolsüz içecekler'),
    ('Alkollü İçecekler', 'Bira, şarap ve diğer alkollü içecekler'); 