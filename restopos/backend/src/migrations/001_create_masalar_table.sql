-- Masa durumları için ENUM tipi oluşturma
CREATE TYPE masa_durum AS ENUM ('Boş', 'Dolu', 'Rezerve', 'Hazırlanıyor');

-- Masalar tablosunu oluşturma
CREATE TABLE masalar (
    id SERIAL PRIMARY KEY,
    masa_numarasi VARCHAR(50) NOT NULL,
    kapasite SMALLINT NOT NULL,
    durum masa_durum DEFAULT 'Boş',
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Masa numarası için tekil indeks
CREATE UNIQUE INDEX masalar_masa_numarasi_idx ON masalar(masa_numarasi);

-- Trigger fonksiyonu oluşturma (guncelleme_tarihi otomatik güncelleme için)
CREATE OR REPLACE FUNCTION update_guncelleme_tarihi_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma
CREATE TRIGGER update_masalar_guncelleme_tarihi
    BEFORE UPDATE
    ON masalar
    FOR EACH ROW
    EXECUTE FUNCTION update_guncelleme_tarihi_column(); 