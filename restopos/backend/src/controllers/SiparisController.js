const BaseController = require('./BaseController');
const Siparis = require('../models/Siparis');
const SiparisDetay = require('../models/SiparisDetay');

class SiparisController extends BaseController {
    // Tüm siparişleri getir
    static async getAll(req, res) {
        return this.handleList(req, res, Siparis);
    }

    // Belirli bir siparişi getir
    static async getById(req, res) {
        return this.handleGet(req, res, Siparis);
    }

    // Yeni sipariş oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const { detaylar, ...siparisData } = req.body;
            
            // Önce siparişi oluştur
            const siparis = await Siparis.create({
                ...siparisData,
                kullanici_id: req.user.id
            });

            // Sipariş detaylarını ekle
            if (detaylar && detaylar.length > 0) {
                for (const detay of detaylar) {
                    await SiparisDetay.create({
                        ...detay,
                        siparis_id: siparis.id
                    });
                }
            }

            // Oluşturulan siparişi detaylarıyla birlikte getir
            const siparisWithDetails = await Siparis.getById(siparis.id);
            
            return this.success(siparisWithDetails, 'Sipariş başarıyla oluşturuldu', 201);
        });
    }

    // Sipariş güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { detaylar, ...siparisData } = req.body;

            // Önce siparişi güncelle
            const siparis = await Siparis.update(id, siparisData);
            
            if (!siparis) {
                return this.notFound();
            }

            // Detaylar varsa güncelle
            if (detaylar && detaylar.length > 0) {
                // Mevcut detayları sil
                await SiparisDetay.deleteAll(id);

                // Yeni detayları ekle
                for (const detay of detaylar) {
                    await SiparisDetay.create({
                        ...detay,
                        siparis_id: id
                    });
                }
            }

            // Güncellenmiş siparişi detaylarıyla birlikte getir
            const updatedSiparis = await Siparis.getById(id);
            
            return this.success(updatedSiparis, 'Sipariş başarıyla güncellendi');
        });
    }

    // Sipariş sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Siparis);
    }

    // Sipariş durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;

            const siparis = await Siparis.updateDurum(id, durum);
            
            if (!siparis) {
                return this.notFound();
            }

            return this.success(siparis, 'Sipariş durumu başarıyla güncellendi');
        });
    }

    // Masaya ait aktif siparişleri getir
    static async getByMasa(req, res) {
        return this.tryCatch(req, res, async () => {
            const { masa_id } = req.params;
            
            const siparisler = await Siparis.getByMasa(masa_id);
            return this.success(siparisler);
        });
    }

    // Kullanıcıya ait siparişleri getir
    static async getByKullanici(req, res) {
        return this.tryCatch(req, res, async () => {
            const siparisler = await Siparis.getByKullanici(req.user.id);
            return this.success(siparisler);
        });
    }

    // Tarih aralığına göre siparişleri getir
    static async getByDateRange(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic, bitis } = req.query;
            
            const siparisler = await Siparis.getByDateRange(baslangic, bitis);
            return this.success(siparisler);
        });
    }

    // Siparişe ürün ekle
    static async urunEkle(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { urun_id, miktar, notlar } = req.body;

            // Önce siparişin var olduğunu kontrol et
            const siparis = await Siparis.getById(id);
            if (!siparis) {
                return this.notFound('Sipariş bulunamadı');
            }

            // Yeni detay ekle
            const detay = await SiparisDetay.create({
                siparis_id: id,
                urun_id,
                miktar,
                notlar
            });

            return this.success(detay, 'Ürün siparişe başarıyla eklendi');
        });
    }

    // Siparişten ürün çıkar
    static async urunCikar(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id, urunId } = req.params;

            // Önce siparişin var olduğunu kontrol et
            const siparis = await Siparis.getById(id);
            if (!siparis) {
                return this.notFound('Sipariş bulunamadı');
            }

            // Detayı sil
            const result = await SiparisDetay.delete(id, urunId);
            if (!result) {
                return this.notFound('Sipariş detayı bulunamadı');
            }

            return this.success(null, 'Ürün siparişten başarıyla çıkarıldı');
        });
    }

    // Sipariş detayını güncelle
    static async updateDetay(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id, detayId } = req.params;
            const { miktar, notlar } = req.body;

            // Önce siparişin var olduğunu kontrol et
            const siparis = await Siparis.getById(id);
            if (!siparis) {
                return this.notFound('Sipariş bulunamadı');
            }

            // Detayı güncelle
            const detay = await SiparisDetay.update(detayId, {
                miktar,
                notlar
            });

            if (!detay) {
                return this.notFound('Sipariş detayı bulunamadı');
            }

            return this.success(detay, 'Sipariş detayı başarıyla güncellendi');
        });
    }

    // Sipariş notlarını güncelle
    static async updateNotlar(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { notlar } = req.body;

            const siparis = await Siparis.updateNotlar(id, notlar);
            
            if (!siparis) {
                return this.notFound('Sipariş bulunamadı');
            }

            return this.success(siparis, 'Sipariş notları başarıyla güncellendi');
        });
    }

    // Sipariş geçmişini getir
    static async getSiparisGecmisi(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;

            // Önce siparişin var olduğunu kontrol et
            const siparis = await Siparis.getById(id);
            if (!siparis) {
                return this.notFound('Sipariş bulunamadı');
            }

            const gecmis = await Siparis.getGecmis(id);
            return this.success(gecmis);
        });
    }
}

module.exports = SiparisController; 