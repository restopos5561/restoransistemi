const BaseController = require('./BaseController');
const Mutfak = require('../models/Mutfak');

class MutfakController extends BaseController {
    // Tüm mutfak siparişlerini getir
    static async getAll(req, res) {
        return this.handleList(req, res, Mutfak);
    }

    // Belirli bir mutfak siparişini getir
    static async getById(req, res) {
        return this.handleGet(req, res, Mutfak);
    }

    // Yeni mutfak siparişi oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Mutfak.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Mutfak siparişi başarıyla oluşturuldu', 201);
        });
    }

    // Mutfak siparişini güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Mutfak.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Mutfak siparişi başarıyla güncellendi');
        });
    }

    // Mutfak siparişini sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Mutfak);
    }

    // Mutfak siparişi durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await Mutfak.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Sipariş durumu başarıyla güncellendi');
        });
    }

    // Kategoriye göre mutfak siparişlerini getir
    static async getByKategori(req, res) {
        return this.tryCatch(req, res, async () => {
            const { kategori_id } = req.params;
            const data = await Mutfak.getByKategori(kategori_id);
            return this.success(data);
        });
    }

    // Masaya göre mutfak siparişlerini getir
    static async getByMasa(req, res) {
        return this.tryCatch(req, res, async () => {
            const { masa_id } = req.params;
            const data = await Mutfak.getByMasa(masa_id);
            return this.success(data);
        });
    }

    // Tarihe göre mutfak siparişlerini getir
    static async getByTarih(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Mutfak.getByTarih(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Mutfak siparişi istatistiklerini getir
    static async getIstatistikler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Mutfak.getIstatistikler(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Mutfak siparişi yazdır
    static async yazdir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { yazici_id } = req.body;
            
            const data = await Mutfak.yazdir(id, yazici_id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Mutfak siparişi başarıyla yazdırıldı');
        });
    }

    // Mutfak siparişi hazır
    static async hazir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Mutfak.hazir(id, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Mutfak siparişi hazır olarak işaretlendi');
        });
    }

    // Mutfak siparişi teslim edildi
    static async teslimEdildi(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Mutfak.teslimEdildi(id, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Mutfak siparişi teslim edildi olarak işaretlendi');
        });
    }

    // Mutfak siparişi iptal et
    static async iptalEt(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { iptal_nedeni } = req.body;
            
            const data = await Mutfak.iptalEt(id, iptal_nedeni, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Mutfak siparişi başarıyla iptal edildi');
        });
    }

    // Mutfak siparişi notunu güncelle
    static async updateNot(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { not } = req.body;
            
            const data = await Mutfak.updateNot(id, not, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Mutfak siparişi notu başarıyla güncellendi');
        });
    }

    // Mutfak siparişi önceliğini güncelle
    static async updateOncelik(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { oncelik } = req.body;
            
            const data = await Mutfak.updateOncelik(id, oncelik, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Mutfak siparişi önceliği başarıyla güncellendi');
        });
    }

    // Tarih aralığına göre siparişleri getir
    static async getByTarihAralik(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.body;
            
            const data = await Mutfak.getByTarihAralik(baslangic_tarihi, bitis_tarihi);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Aktif siparişleri getir
    static async getAktifSiparisler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Mutfak.getAktifSiparisler();
            return this.success(data);
        });
    }

    // Bekleyen siparişleri getir
    static async getBekleyenSiparisler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Mutfak.getBekleyenSiparisler();
            return this.success(data);
        });
    }

    // Tamamlanan siparişleri getir
    static async getTamamlananSiparisler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Mutfak.getTamamlananSiparisler();
            return this.success(data);
        });
    }

    // İptal edilen siparişleri getir
    static async getIptalEdilenSiparisler(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Mutfak.getIptalEdilenSiparisler();
            return this.success(data);
        });
    }

    // Personele göre siparişleri getir
    static async getByPersonel(req, res) {
        return this.tryCatch(req, res, async () => {
            const { personelId } = req.params;
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            
            const data = await Mutfak.getByPersonel(
                personelId, 
                baslangic_tarihi, 
                bitis_tarihi
            );
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Performans raporu getir
    static async getPerformansRaporu(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            
            const data = await Mutfak.getPerformansRaporu(
                baslangic_tarihi,
                bitis_tarihi
            );
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }
}

module.exports = MutfakController; 