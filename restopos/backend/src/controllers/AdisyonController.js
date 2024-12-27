const BaseController = require('./BaseController');
const Adisyon = require('../models/Adisyon');

class AdisyonController extends BaseController {
    // Tüm adisyonları getir
    static async getAll(req, res) {
        return this.handleList(req, res, Adisyon);
    }

    // Belirli bir adisyonu getir
    static async getById(req, res) {
        return this.handleGet(req, res, Adisyon);
    }

    // Yeni adisyon oluştur
    static async create(req, res) {
        return this.tryCatch(req, res, async () => {
            const data = await Adisyon.create({
                ...req.body,
                kullanici_id: req.user.id
            });
            return this.success(data, 'Adisyon başarıyla oluşturuldu', 201);
        });
    }

    // Adisyon güncelle
    static async update(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Adisyon.update(id, req.body);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon başarıyla güncellendi');
        });
    }

    // Adisyon sil
    static async delete(req, res) {
        return this.handleDelete(req, res, Adisyon);
    }

    // Adisyon durumunu güncelle
    static async updateDurum(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { durum } = req.body;
            
            const data = await Adisyon.updateDurum(id, durum);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon durumu başarıyla güncellendi');
        });
    }

    // Masaya göre adisyonları getir
    static async getByMasa(req, res) {
        return this.tryCatch(req, res, async () => {
            const { masa_id } = req.params;
            const data = await Adisyon.getByMasa(masa_id);
            return this.success(data);
        });
    }

    // Müşteriye göre adisyonları getir
    static async getByMusteri(req, res) {
        return this.tryCatch(req, res, async () => {
            const { musteri_id } = req.params;
            const data = await Adisyon.getByMusteri(musteri_id);
            return this.success(data);
        });
    }

    // Adisyona ürün ekle
    static async addUrun(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { urun_id, miktar, birim_fiyat, notlar } = req.body;
            
            const data = await Adisyon.addUrun(id, {
                    urun_id,
                    miktar,
                    birim_fiyat,
                notlar,
                kullanici_id: req.user.id
            });
            
            return this.success(data, 'Ürün başarıyla eklendi');
        });
    }

    // Adisyondan ürün çıkar
    static async removeUrun(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id, urun_id } = req.params;
            const data = await Adisyon.removeUrun(id, urun_id, req.user.id);
            return this.success(data, 'Ürün başarıyla çıkarıldı');
        });
    }

    // Adisyon kapat
    static async kapat(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { odeme_tipi, odeme_tutari, aciklama } = req.body;
            
            const data = await Adisyon.kapat(id, {
                odeme_tipi,
                odeme_tutari,
                aciklama,
                kullanici_id: req.user.id
            });
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon başarıyla kapatıldı');
        });
    }

    // Adisyon iptal et
    static async iptalEt(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { iptal_nedeni } = req.body;

            const data = await Adisyon.iptalEt(id, iptal_nedeni, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon başarıyla iptal edildi');
        });
    }

    // Adisyon yazdır
    static async yazdir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { yazici_id } = req.body;
            
            const data = await Adisyon.yazdir(id, yazici_id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon başarıyla yazdırıldı');
        });
    }

    // Adisyon fişi yazdır
    static async fisYazdir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { yazici_id } = req.body;
            
            const data = await Adisyon.fisYazdir(id, yazici_id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon fişi başarıyla yazdırıldı');
        });
    }

    // Adisyon istatistiklerini getir
    static async getIstatistikler(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.query;
            const data = await Adisyon.getIstatistikler(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }

    // Adisyon özetini getir
    static async getOzet(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const data = await Adisyon.getOzet(id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data);
        });
    }

    // Adisyonu böl
    static async bol(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { kalemler } = req.body;
            
            const data = await Adisyon.bol(id, kalemler, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Adisyon başarıyla bölündü');
        });
    }

    // Adisyonları birleştir
    static async birlestir(req, res) {
        return this.tryCatch(req, res, async () => {
            const { ana_adisyon_id, birlestirilecek_adisyon_id } = req.body;
            
            const data = await Adisyon.birlestir(ana_adisyon_id, birlestirilecek_adisyon_id, req.user.id);
            return this.success(data, 'Adisyonlar başarıyla birleştirildi');
        });
    }

    // İndirim uygula
    static async indirimUygula(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { indirim_tipi, indirim_tutari, aciklama } = req.body;
            
            const data = await Adisyon.indirimUygula(id, {
                indirim_tipi,
                indirim_tutari,
                aciklama,
                kullanici_id: req.user.id
            });
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'İndirim başarıyla uygulandı');
        });
    }

    // İkram uygula
    static async ikramUygula(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { urun_id, miktar, aciklama } = req.body;
            
            const data = await Adisyon.ikramUygula(id, {
                urun_id,
                miktar,
                aciklama,
                kullanici_id: req.user.id
            });
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'İkram başarıyla uygulandı');
        });
    }

    // Ödeme ekle
    static async odemeEkle(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id } = req.params;
            const { odeme_tipi, tutar, aciklama } = req.body;
            
            const data = await Adisyon.odemeEkle(id, {
                odeme_tipi,
                tutar,
                aciklama,
                kullanici_id: req.user.id
            });
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Ödeme başarıyla eklendi');
        });
    }

    // Ödeme sil
    static async odemeSil(req, res) {
        return this.tryCatch(req, res, async () => {
            const { id, odemeId } = req.params;
            
            const data = await Adisyon.odemeSil(id, odemeId, req.user.id);
            
            if (!data) {
                return this.notFound();
            }
            
            return this.success(data, 'Ödeme başarıyla silindi');
        });
    }

    // Personele göre adisyonları getir
    static async getByPersonel(req, res) {
        return this.tryCatch(req, res, async () => {
            const { personelId } = req.params;
            const data = await Adisyon.getByPersonel(personelId);
            return this.success(data);
        });
    }

    // Tarih aralığına göre adisyonları getir
    static async getByTarihAralik(req, res) {
        return this.tryCatch(req, res, async () => {
            const { baslangic_tarihi, bitis_tarihi } = req.body;
            const data = await Adisyon.getByTarihAralik(baslangic_tarihi, bitis_tarihi);
            return this.success(data);
        });
    }
}

module.exports = AdisyonController; 