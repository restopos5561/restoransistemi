-- Reçeteler tablosunu oluşturma
CREATE TABLE receteler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reçete kalemleri tablosunu oluşturma
CREATE TABLE recete_kalemleri (
    id SERIAL PRIMARY KEY,
    recete_id INTEGER NOT NULL,
    urun_id INTEGER NOT NULL,
    miktar DECIMAL(10,3) NOT NULL CHECK (miktar > 0),
    birim TEXT NOT NULL,
    CONSTRAINT fk_recete
        FOREIGN KEY (recete_id)
        REFERENCES receteler(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_urun
        FOREIGN KEY (urun_id)
        REFERENCES urunler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- İndeksler
CREATE INDEX receteler_ad_idx ON receteler(ad);
CREATE INDEX recete_kalemleri_recete_id_idx ON recete_kalemleri(recete_id);
CREATE INDEX recete_kalemleri_urun_id_idx ON recete_kalemleri(urun_id);

-- Trigger fonksiyonu oluşturma (guncelleme_tarihi otomatik güncelleme için)
CREATE OR REPLACE FUNCTION update_recete_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma
CREATE TRIGGER update_receteler_guncelleme_tarihi
    BEFORE UPDATE
    ON receteler
    FOR EACH ROW
    EXECUTE FUNCTION update_recete_guncelleme_tarihi(); 