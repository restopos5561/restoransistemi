-- Fiyat değişiklik log tablosunu oluşturma
CREATE TABLE fiyat_degisiklik_log (
    id SERIAL PRIMARY KEY,
    urun_id INTEGER NOT NULL,
    eski_fiyat DECIMAL(10,2) NOT NULL,
    yeni_fiyat DECIMAL(10,2) NOT NULL,
    degisiklik_nedeni TEXT,
    personel_id INTEGER,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_urun
        FOREIGN KEY (urun_id)
        REFERENCES urunler(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_personel
        FOREIGN KEY (personel_id)
        REFERENCES kullanicilar(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- İndeksler
CREATE INDEX fiyat_degisiklik_log_urun_id_idx ON fiyat_degisiklik_log(urun_id);
CREATE INDEX fiyat_degisiklik_log_personel_id_idx ON fiyat_degisiklik_log(personel_id);
CREATE INDEX fiyat_degisiklik_log_olusturma_tarihi_idx ON fiyat_degisiklik_log(olusturma_tarihi);

-- Fiyat değişikliği için trigger
CREATE OR REPLACE FUNCTION log_urun_fiyat_degisikligi()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') AND (OLD.fiyat IS DISTINCT FROM NEW.fiyat) THEN
        INSERT INTO fiyat_degisiklik_log (
            urun_id,
            eski_fiyat,
            yeni_fiyat,
            personel_id
        ) VALUES (
            NEW.id,
            OLD.fiyat,
            NEW.fiyat,
            NULL
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fiyat değişikliği için trigger oluşturma
CREATE TRIGGER log_urun_fiyat_degisikligi_trigger
    AFTER UPDATE
    ON urunler
    FOR EACH ROW
    EXECUTE FUNCTION log_urun_fiyat_degisikligi(); 