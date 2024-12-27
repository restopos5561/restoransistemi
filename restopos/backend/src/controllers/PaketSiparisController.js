const BaseController = require('./BaseController');
const PaketSiparis = require('../models/PaketSiparis');

class PaketSiparisController extends BaseController {
    // Tüm paket siparişleri getir
    static async getAll(req, res) {
        return this.handleList(req, res, PaketSiparis);
    }

    // Belirli bir paket siparişi getir
    static async getById(req, res) {
        return this.handleGet(req, res, PaketSiparis);
    }

    // Yeni paket siparişi oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await PaketSiparis.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Paket siparişi başarıyla oluşturuldu', 201);
        });
    }

    // Paket siparişi güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await PaketSiparis.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi başarıyla güncellendi');
        });
    }

    // Paket siparişi sil
    static async delete(req, res) {
        return this.handleDelete(req, res, PaketSiparis);
    }

    // Paket siparişi durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await PaketSiparis.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi durumu başarıyla güncellendi');
        });
    }

    // Müşteriye göre paket siparişleri getir
    static async getByMusteri(req, res) {
        return this.tryCatch(req, res, async () => {
            const { musteri_id } = req.params;
            const data = await PaketSiparis.getByMusteri(musteri_id);
            return this.success(data);
        });
    }

    // Kuryeye göre paket siparişleri getir
    static async getByKurye(req, res) {
        return this.tryCatch(req, res, async () => {
            const { kurye_id } = req.params;
            const data = await PaketSiparis.getByKurye(kurye_id);
            return this.success(data);
        });
    }

    // Tarihe göre paket siparişleri getir
    static async getByTarih(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await PaketSiparis.getByTarih(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Paket siparişi istatistiklerini getir
    static async getIstatistikler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await PaketSiparis.getIstatistikler(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Paket siparişi yazdır
    static async yazdir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { yazici_id } = req.body;
            
            const data = await PaketSiparis.yazdir(id, yazici_id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi başarıyla yazdırıldı');
        });
    }

    // Paket siparişi hazır
    static async hazir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await PaketSiparis.hazir(id, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi hazır olarak işaretlendi');
        });
    }

    // Paket siparişi yola çıktı
    static async yolaCikti(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { kurye_id } = req.body;
            
            const data = await PaketSiparis.yolaCikti(id, kurye_id, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi yola çıktı olarak işaretlendi');
        });
    }

    // Paket siparişi teslim edildi
    static async teslimEdildi(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await PaketSiparis.teslimEdildi(id, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi teslim edildi olarak işaretlendi');
        });
    }

    // Paket siparişi iptal et
    static async iptalEt(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { iptal_nedeni } = req.body;
            
            const data = await PaketSiparis.iptalEt(id, iptal_nedeni, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi başarıyla iptal edildi');
        });
    }

    // Paket siparişi adresini güncelle
    static async updateAdres(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { adres } = req.body;
            
            const data = await PaketSiparis.updateAdres(id, adres, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi adresi başarıyla güncellendi');
        });
    }

    // Paket siparişi notunu güncelle
    static async updateNot(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { not } = req.body;
            
            const data = await PaketSiparis.updateNot(id, not, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi notu başarıyla güncellendi');
        });
    }

    // Paket siparişi önceliğini güncelle
    static async updateOncelik(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { oncelik } = req.body;
            
            const data = await PaketSiparis.updateOncelik(id, oncelik, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi önceliği başarıyla güncellendi');
        });
    }

    // Kurye güncelle
    static async updateKurye(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { kurye_id } = req.body;
            
            const data = await PaketSiparis.updateKurye(id, kurye_id, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Kurye başarıyla atandı');
        });
    }

    // Paket siparişi ödeme durumunu güncelle
    static async updateOdemeDurumu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { odeme_durumu } = req.body;
            
            const data = await PaketSiparis.updateOdemeDurumu(id, odeme_durumu, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi ödeme durumu başarıyla güncellendi');
        });
    }

    // Paket siparişi teslimat süresini güncelle
    static async updateTeslimatSuresi(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { teslimat_suresi } = req.body;
            
            const data = await PaketSiparis.updateTeslimatSuresi(id, teslimat_suresi, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi teslimat süresi başarıyla güncellendi');
        });
    }

    // Paket siparişi müşteri bilgilerini güncelle
    static async updateMusteriBilgileri(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { musteri_bilgileri } = req.body;
            
            const data = await PaketSiparis.updateMusteriBilgileri(id, musteri_bilgileri, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Paket siparişi müşteri bilgileri başarıyla güncellendi');
        });
    }

    // Aktif paket siparişlerini getir
    static async getAktifSiparisler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await PaketSiparis.getByDurum('aktif');
            return this.success(data);
        });
    }

    // Bekleyen paket siparişlerini getir
    static async getBekleyenSiparisler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await PaketSiparis.getByDurum('beklemede');
            return this.success(data);
        });
    }

    // Tamamlanan paket siparişlerini getir
    static async getTamamlananSiparisler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await PaketSiparis.getByDurum('tamamlandi');
            return this.success(data);
        });
    }

    // İptal edilen paket siparişlerini getir
    static async getIptalEdilenSiparisler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await PaketSiparis.getByDurum('iptal');
            return this.success(data);
        });
    }

    // Bölgeye göre paket siparişlerini getir
    static async getByBolge(req, res) {
        return this.tryCatch(req, res, async () => {
            const { bolgeId } = req.params;
            const data = await PaketSiparis.getByBolge(bolgeId);
            return this.success(data);
        });
    }

    // Performans raporu getir
    static async getPerformansRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await PaketSiparis.getPerformansRaporu(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Tarih aralığına göre paket siparişlerini getir
    static async getByTarihAralik(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await PaketSiparis.getByTarihAralik(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }
}

module.exports = PaketSiparisController; 