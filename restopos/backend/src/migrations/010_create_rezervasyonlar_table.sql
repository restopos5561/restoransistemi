-- Rezervasyon durumları için ENUM oluşturma
CREATE TYPE rezervasyon_durum AS ENUM (
    'ONAY_BEKLIYOR',
    'ONAYLANDI',
    'IPTAL',
    'TAMAMLANDI'
);

-- Rezervasyonlar tablosunu oluşturma
CREATE TABLE rezervasyonlar (
    id SERIAL PRIMARY KEY,
    masa_id INTEGER NOT NULL,
    musteri_id INTEGER NOT NULL,
    tarih TIMESTAMP WITH TIME ZONE NOT NULL,
    kisi_sayisi INTEGER NOT NULL CHECK (kisi_sayisi > 0),
    notlar TEXT,
    durum rezervasyon_durum DEFAULT 'ONAY_BEKLIYOR' NOT NULL,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_masa
        FOREIGN KEY (masa_id)
        REFERENCES masalar(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_musteri
        FOREIGN KEY (musteri_id)
        REFERENCES cariler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- İndeksler
CREATE INDEX rezervasyonlar_masa_id_idx ON rezervasyonlar(masa_id);
CREATE INDEX rezervasyonlar_musteri_id_idx ON rezervasyonlar(musteri_id);
CREATE INDEX rezervasyonlar_tarih_idx ON rezervasyonlar(tarih);
CREATE INDEX rezervasyonlar_durum_idx ON rezervasyonlar(durum);

-- Trigger fonksiyonu oluşturma (guncelleme_tarihi otomatik güncelleme için)
CREATE OR REPLACE FUNCTION update_rezervasyon_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma
CREATE TRIGGER update_rezervasyonlar_guncelleme_tarihi
    BEFORE UPDATE
    ON rezervasyonlar
    FOR EACH ROW
    EXECUTE FUNCTION update_rezervasyon_guncelleme_tarihi();

-- Çakışma kontrolü için trigger
CREATE OR REPLACE FUNCTION check_rezervasyon_cakisma()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM rezervasyonlar
        WHERE masa_id = NEW.masa_id
        AND id != COALESCE(NEW.id, 0)
        AND durum NOT IN ('IPTAL', 'TAMAMLANDI')
        AND tarih BETWEEN NEW.tarih - INTERVAL '2 hours' AND NEW.tarih + INTERVAL '2 hours'
    ) THEN
        RAISE EXCEPTION 'Bu masa için belirtilen saatte başka bir rezervasyon mevcut';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Çakışma kontrolü için trigger oluşturma
CREATE TRIGGER check_rezervasyon_cakisma_trigger
    BEFORE INSERT OR UPDATE
    ON rezervasyonlar
    FOR EACH ROW
    EXECUTE FUNCTION check_rezervasyon_cakisma(); 