-- Token sütunlarını ekle
ALTER TABLE kullanicilar
ADD COLUMN IF NOT EXISTS refresh_token VARCHAR(500),
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(500); 