const BaseController = require('./BaseController');
const Urun = require('../models/Urun');

class UrunController extends BaseController {
    // Tüm ürünleri getir
    static async getAll(req, res) {
        return this.handleList(req, res, Urun);
    }

    // Belirli bir ürünü getir
    static async getById(req, res) {
        return this.handleGet(req, res, Urun);
    }

    // Yeni ürün oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Urun.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Ürün başarıyla oluşturuldu', 201);
        });
    }

    // Ürün güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Urun.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Ürün başarıyla güncellendi');
        });
    }

    // Ürün sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Urun);
    }

    // Kategoriye göre ürünleri getir
    static async getByKategori(req, res) {
        return this.tryCatch(req, res, async () => {
            const { kategori_id } = req.params;
            const data = await Urun.getByKategori(kategori_id);
            return this.success(data);
        });
    }

    // Stok durumuna göre ürünleri getir
    static async getByStokDurumu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { durum } = req.params;
            const data = await Urun.getByStokDurumu(durum);
            return this.success(data);
        });
    }

    // Ürün fiyatını güncelle
    static async updateFiyat(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { fiyat, gecerlilik_tarihi } = req.body;
            
            const data = await Urun.updateFiyat(id, fiyat, gecerlilik_tarihi, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Ürün fiyatı başarıyla güncellendi');
        });
    }

    // Ürün stok miktarını güncelle
    static async updateStok(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { miktar, aciklama } = req.body;
            
            const data = await Urun.updateStok(id, miktar, aciklama, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Ürün stok miktarı başarıyla güncellendi');
        });
    }

    // Ürün durumunu güncelle (aktif/pasif)
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await Urun.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Ürün durumu başarıyla güncellendi');
        });
    }

    // Ürün fiyat geçmişini getir
    static async getFiyatGecmisi(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            
            const data = await Urun.getFiyatGecmisi(id, baslangic_tarihi, bitis_tarihi);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Ürün stok hareketlerini getir
    static async getStokHareketleri(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            
            const data = await Urun.getStokHareketleri(id, baslangic_tarihi, bitis_tarihi);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Ürün satış istatistiklerini getir
    static async getSatisIstatistikleri(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            
            const data = await Urun.getSatisIstatistikleri(id, baslangic_tarihi, bitis_tarihi);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Toplu ürün fiyat güncellemesi
    static async bulkUpdateFiyat(req, res) {
        return this.tryCatch(req, res, async () => {
            const { urunler } = req.body;
            const data = await Urun.bulkUpdateFiyat(urunler, req.user.id);
            return this.success(data, 'Ürün fiyatları başarıyla güncellendi');
        });
    }

    // Ürün ara
    static async search(req, res) {
        return this.tryCatch(req, res, async () => {
            const { query } = req.query;
            const data = await Urun.search(query);
            return this.success(data);
        });
    }

    // Ürün resmini güncelle
    static async updateResim(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { file } = req;

            if (!file) {
                return this.error('Resim dosyası bulunamadı', 400);
            }

            const data = await Urun.updateResim(id, {
                ...file,
                kullanici_id: req.user.id
            });

            if (!data) {
                return this.notFound();
            }

            return this.success(data, 'Ürün resmi başarıyla güncellendi');
        });
    }

    // Toplu ürün güncellemesi
    static async topluGuncelle(req, res) {
        return this.tryCatch(req, res, async () => {
            const { urunler } = req.body;
            
            // Her bir ürün için güncelleme yap
            const sonuclar = await Promise.all(
                urunler.map(async (urun) => {
                    try {
                        const data = await Urun.update(urun.id, {
                            ...urun,
                            kullanici_id: req.user.id
                        });
                        return {
                            id: urun.id,
                            basarili: true,
                            data
                        };
                    } catch (error) {
                        return {
                            id: urun.id,
                            basarili: false,
                            hata: error.message
                        };
                    }
                })
            );

            // Başarılı ve başarısız güncellemeleri ayır
            const basarili = sonuclar.filter(s => s.basarili);
            const basarisiz = sonuclar.filter(s => !s.basarili);

            return this.success({
                basarili_sayisi: basarili.length,
                basarisiz_sayisi: basarisiz.length,
                basarili,
                basarisiz
            }, 'Toplu güncelleme tamamlandı');
        });
    }
}

module.exports = UrunController; 