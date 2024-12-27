-- Stok uyarıları tablosunu oluşturma
CREATE TABLE stok_uyarilari (
    id SERIAL PRIMARY KEY,
    stok_id INTEGER NOT NULL,
    urun_id INTEGER NOT NULL,
    miktar DECIMAL(10,2) NOT NULL,
    kritik_seviye DECIMAL(10,2) NOT NULL,
    uyari_mesaji TEXT NOT NULL,
    okundu BOOLEAN DEFAULT false,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_stok
        FOREIGN KEY (stok_id)
        REFERENCES stoklar(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_urun
        FOREIGN KEY (urun_id)
        REFERENCES urunler(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Stok ID için indeks
CREATE INDEX stok_uyarilari_stok_id_idx ON stok_uyarilari(stok_id);

-- Ürün ID için indeks
CREATE INDEX stok_uyarilari_urun_id_idx ON stok_uyarilari(urun_id);

-- Okunmamış uyarılar için indeks
CREATE INDEX stok_uyarilari_okundu_idx ON stok_uyarilari(okundu) 
WHERE okundu = false; 