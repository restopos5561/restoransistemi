-- Uploads tablosunu oluştur
CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    encoding VARCHAR(50),
    mime_type VARCHAR(100),
    destination VARCHAR(255),
    filename VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL,
    kullanici_id INTEGER REFERENCES kullanicilar(id),
    metadata JSONB,
    tags JSONB,
    description TEXT,
    category VARCHAR(100),
    updated_by INTEGER REFERENCES kullanicilar(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    aktif BOOLEAN DEFAULT TRUE
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_uploads_kullanici_id ON uploads(kullanici_id);
CREATE INDEX IF NOT EXISTS idx_uploads_mime_type ON uploads(mime_type);
CREATE INDEX IF NOT EXISTS idx_uploads_created_at ON uploads(created_at);
CREATE INDEX IF NOT EXISTS idx_uploads_category ON uploads(category);
CREATE INDEX IF NOT EXISTS idx_uploads_aktif ON uploads(aktif);

-- Açıklamalar
COMMENT ON TABLE uploads IS 'Sistemde yüklenen dosyaların bilgilerini tutar';
COMMENT ON COLUMN uploads.original_name IS 'Dosyanın orijinal adı';
COMMENT ON COLUMN uploads.encoding IS 'Dosya kodlaması';
COMMENT ON COLUMN uploads.mime_type IS 'Dosya türü';
COMMENT ON COLUMN uploads.destination IS 'Dosyanın yüklendiği dizin';
COMMENT ON COLUMN uploads.filename IS 'Sistemdeki dosya adı';
COMMENT ON COLUMN uploads.path IS 'Dosyanın tam yolu';
COMMENT ON COLUMN uploads.size IS 'Dosya boyutu (byte)';
COMMENT ON COLUMN uploads.kullanici_id IS 'Dosyayı yükleyen kullanıcı';
COMMENT ON COLUMN uploads.metadata IS 'Dosya meta verileri';
COMMENT ON COLUMN uploads.tags IS 'Dosya etiketleri';
COMMENT ON COLUMN uploads.description IS 'Dosya açıklaması';
COMMENT ON COLUMN uploads.category IS 'Dosya kategorisi';
COMMENT ON COLUMN uploads.updated_by IS 'Son güncelleyen kullanıcı';
COMMENT ON COLUMN uploads.aktif IS 'Dosyanın aktif olup olmadığı'; 