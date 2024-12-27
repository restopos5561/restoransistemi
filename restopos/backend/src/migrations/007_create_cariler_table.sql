-- Cari tipleri için ENUM oluşturma
CREATE TYPE cari_tipi AS ENUM ('Müşteri', 'Tedarikçi', 'Personel', 'Uye');

-- Cariler tablosunu oluşturma
CREATE TABLE cariler (
    id SERIAL PRIMARY KEY,
    cari_tipi cari_tipi NOT NULL,
    ad VARCHAR(100) NOT NULL,
    soyad VARCHAR(100),
    unvan VARCHAR(200),
    telefon VARCHAR(20),
    e_posta VARCHAR(100),
    adres TEXT,
    vergi_dairesi VARCHAR(100),
    vergi_numarasi VARCHAR(20),
    bakiye DECIMAL(12,2) DEFAULT 0 NOT NULL,
    aktif BOOLEAN DEFAULT true NOT NULL,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_vergi_bilgileri 
        CHECK (
            (vergi_dairesi IS NULL AND vergi_numarasi IS NULL) OR
            (vergi_dairesi IS NOT NULL AND vergi_numarasi IS NOT NULL)
        ),
    CONSTRAINT check_unvan_veya_isim
        CHECK (
            (unvan IS NOT NULL) OR
            (ad IS NOT NULL)
        )
);

-- Ad ve soyad için indeks
CREATE INDEX cariler_ad_soyad_idx ON cariler(ad, soyad);

-- Unvan için indeks
CREATE INDEX cariler_unvan_idx ON cariler(unvan) 
WHERE unvan IS NOT NULL;

-- Telefon için indeks
CREATE INDEX cariler_telefon_idx ON cariler(telefon) 
WHERE telefon IS NOT NULL;

-- E-posta için indeks
CREATE INDEX cariler_eposta_idx ON cariler(e_posta) 
WHERE e_posta IS NOT NULL;

-- Vergi numarası için indeks
CREATE INDEX cariler_vergi_no_idx ON cariler(vergi_numarasi) 
WHERE vergi_numarasi IS NOT NULL;

-- Cari tipi için indeks
CREATE INDEX cariler_tipi_idx ON cariler(cari_tipi);

-- Aktif cariler için indeks
CREATE INDEX cariler_aktif_idx ON cariler(aktif);

-- Trigger fonksiyonu oluşturma (guncelleme_tarihi otomatik güncelleme için)
CREATE OR REPLACE FUNCTION update_cari_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma
CREATE TRIGGER update_cariler_guncelleme_tarihi
    BEFORE UPDATE
    ON cariler
    FOR EACH ROW
    EXECUTE FUNCTION update_cari_guncelleme_tarihi();

-- E-posta ve telefon formatı kontrolü için trigger
CREATE OR REPLACE FUNCTION validate_cari_contact_info()
RETURNS TRIGGER AS $$
BEGIN
    -- E-posta format kontrolü
    IF NEW.e_posta IS NOT NULL AND NEW.e_posta !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Geçersiz e-posta formatı';
    END IF;
    
    -- Telefon format kontrolü (sadece rakam ve +)
    IF NEW.telefon IS NOT NULL AND NEW.telefon !~ '^\+?[0-9]{10,15}$' THEN
        RAISE EXCEPTION 'Geçersiz telefon numarası formatı';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- İletişim bilgileri kontrolü için trigger oluşturma
CREATE TRIGGER validate_cari_contact_info_trigger
    BEFORE INSERT OR UPDATE OF e_posta, telefon
    ON cariler
    FOR EACH ROW
    EXECUTE FUNCTION validate_cari_contact_info();

-- Bakiye hareketi tablosunu oluşturma
CREATE TABLE cari_bakiye_hareketleri (
    id SERIAL PRIMARY KEY,
    cari_id INTEGER NOT NULL,
    hareket_tipi VARCHAR(20) NOT NULL CHECK (hareket_tipi IN ('Borç', 'Alacak')),
    tutar DECIMAL(12,2) NOT NULL,
    aciklama TEXT,
    referans_id INTEGER,
    referans_tipi VARCHAR(50),
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_cari
        FOREIGN KEY (cari_id)
        REFERENCES cariler(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Cari bakiye hareketleri için indeksler
CREATE INDEX cari_bakiye_hareketleri_cari_id_idx ON cari_bakiye_hareketleri(cari_id);
CREATE INDEX cari_bakiye_hareketleri_tarih_idx ON cari_bakiye_hareketleri(olusturma_tarihi);
CREATE INDEX cari_bakiye_hareketleri_referans_idx ON cari_bakiye_hareketleri(referans_id, referans_tipi);

-- Bakiye güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_cari_bakiye()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.hareket_tipi = 'Borç' THEN
        UPDATE cariler
        SET bakiye = bakiye + NEW.tutar
        WHERE id = NEW.cari_id;
    ELSIF NEW.hareket_tipi = 'Alacak' THEN
        UPDATE cariler
        SET bakiye = bakiye - NEW.tutar
        WHERE id = NEW.cari_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Bakiye güncelleme trigger'ını oluşturma
CREATE TRIGGER update_cari_bakiye_trigger
    AFTER INSERT
    ON cari_bakiye_hareketleri
    FOR EACH ROW
    EXECUTE FUNCTION update_cari_bakiye(); 