-- Ödemeler tablosu zaten 008_create_adisyonlar_tables.sql dosyasında oluşturuldu
-- Bu dosya sadece ek indeksler ve trigger'lar ekleyecek

-- Ödeme tipi için indeks
CREATE INDEX IF NOT EXISTS odemeler_odeme_tipi_idx ON odemeler(odeme_tipi);

-- Referans no için indeks
CREATE INDEX IF NOT EXISTS odemeler_referans_no_idx ON odemeler(referans_no) 
WHERE referans_no IS NOT NULL;

-- Ödeme eklendiğinde adisyon tutarını kontrol eden trigger
CREATE OR REPLACE FUNCTION check_odeme_tutari()
RETURNS TRIGGER AS $$
BEGIN
    -- Adisyonun toplam tutarını ve mevcut ödemeleri kontrol et
    IF (
        SELECT (toplam_tutar - indirim_tutari) - COALESCE(
            (SELECT SUM(tutar) FROM odemeler WHERE adisyon_id = NEW.adisyon_id AND id != COALESCE(NEW.id, 0)),
            0
        )
        FROM adisyonlar
        WHERE id = NEW.adisyon_id
    ) < NEW.tutar THEN
        RAISE EXCEPTION 'Ödeme tutarı adisyonun kalan tutarından büyük olamaz';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ödeme tutarı kontrolü için trigger oluşturma
CREATE TRIGGER check_odeme_tutari_trigger
    BEFORE INSERT OR UPDATE
    ON odemeler
    FOR EACH ROW
    EXECUTE FUNCTION check_odeme_tutari(); 