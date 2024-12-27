-- Paket sipariş durumları için ENUM oluşturma
CREATE TYPE paket_siparis_durum AS ENUM (
    'YENI',
    'HAZIRLANIYOR',
    'HAZIRLANDI',
    'YOLDA',
    'TESLIM_EDILDI',
    'IPTAL_EDILDI'
);

-- Paket siparişler tablosunu oluşturma
CREATE TABLE paket_siparisler (
    id SERIAL PRIMARY KEY,
    adisyon_id INTEGER NOT NULL,
    musteri_id INTEGER NOT NULL,
    teslimat_adresi TEXT NOT NULL,
    teslimat_notu TEXT,
    kurye_id INTEGER,
    durum paket_siparis_durum DEFAULT 'YENI' NOT NULL,
    tahmini_teslimat_suresi INTEGER, -- Dakika cinsinden
    teslimat_tarihi TIMESTAMP WITH TIME ZONE,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_adisyon
        FOREIGN KEY (adisyon_id)
        REFERENCES adisyonlar(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_musteri
        FOREIGN KEY (musteri_id)
        REFERENCES cariler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_kurye
        FOREIGN KEY (kurye_id)
        REFERENCES kullanicilar(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Paket sipariş durum geçmişi tablosunu oluşturma
CREATE TABLE paket_siparis_durum_gecmisi (
    id SERIAL PRIMARY KEY,
    siparis_id INTEGER NOT NULL,
    eski_durum paket_siparis_durum,
    yeni_durum paket_siparis_durum NOT NULL,
    aciklama TEXT,
    personel_id INTEGER,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_siparis
        FOREIGN KEY (siparis_id)
        REFERENCES paket_siparisler(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_personel
        FOREIGN KEY (personel_id)
        REFERENCES kullanicilar(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- İndeksler
CREATE INDEX paket_siparisler_adisyon_id_idx ON paket_siparisler(adisyon_id);
CREATE INDEX paket_siparisler_musteri_id_idx ON paket_siparisler(musteri_id);
CREATE INDEX paket_siparisler_kurye_id_idx ON paket_siparisler(kurye_id);
CREATE INDEX paket_siparisler_durum_idx ON paket_siparisler(durum);
CREATE INDEX paket_siparis_durum_gecmisi_siparis_id_idx ON paket_siparis_durum_gecmisi(siparis_id);

-- Trigger fonksiyonu oluşturma (guncelleme_tarihi otomatik güncelleme için)
CREATE OR REPLACE FUNCTION update_paket_siparis_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma
CREATE TRIGGER update_paket_siparisler_guncelleme_tarihi
    BEFORE UPDATE
    ON paket_siparisler
    FOR EACH ROW
    EXECUTE FUNCTION update_paket_siparis_guncelleme_tarihi();

-- Durum değişikliği için trigger
CREATE OR REPLACE FUNCTION log_paket_siparis_durum_degisikligi()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (OLD.durum IS DISTINCT FROM NEW.durum) THEN
        INSERT INTO paket_siparis_durum_gecmisi (
            siparis_id,
            eski_durum,
            yeni_durum,
            aciklama,
            personel_id
        ) VALUES (
            NEW.id,
            CASE WHEN TG_OP = 'UPDATE' THEN OLD.durum ELSE NULL END,
            NEW.durum,
            'Durum güncellendi',
            CURRENT_USER::INTEGER
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Durum değişikliği için trigger oluşturma
CREATE TRIGGER log_paket_siparis_durum_degisikligi
    AFTER INSERT OR UPDATE
    ON paket_siparisler
    FOR EACH ROW
    EXECUTE FUNCTION log_paket_siparis_durum_degisikligi(); 