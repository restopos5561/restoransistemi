const BaseController = require('./BaseController');
const Stok = require('../models/Stok');
const StokHareketi = require('../models/StokHareketi');
const StokUyari = require('../models/StokUyari');
const Urun = require('../models/Urun');

class StokController extends BaseController {
  // Tüm stokları listele
  static async getAll(req, res) {
    return this.tryCatch(req, res, async () => {
      const stoklar = await Stok.getAll();
      return this.success(stoklar);
    });
  }

  // Belirli bir stok kaydını getir
  static async getById(req, res) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      const stok = await Stok.getById(id);
      
      if (!stok) {
        return this.notFound('Stok kaydı bulunamadı');
      }

      return this.success(stok);
    });
  }

  // Yeni stok kaydı oluştur
  static async create(req, res) {
    return this.tryCatch(req, res, async () => {
      const stok = await Stok.create(req.body);
      return this.success(stok, 'Stok kaydı başarıyla oluşturuldu', 201);
    });
  }

  // Stok kaydını güncelle
  static async update(req, res) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      const stok = await Stok.update(id, req.body);
      
      if (!stok) {
        return this.notFound('Stok kaydı bulunamadı');
      }

      return this.success(stok, 'Stok kaydı başarıyla güncellendi');
    });
  }

  // Stok kaydını sil
  static async delete(req, res) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      const result = await Stok.delete(id);
      
      if (!result) {
        return this.notFound('Stok kaydı bulunamadı');
      }

      return this.success(null, 'Stok kaydı başarıyla silindi');
    });
  }

  // Stok giriş hareketi ekle
  static async stokGiris(req, res) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      const { miktar, aciklama } = req.body;

      const stok = await Stok.getById(id);
      if (!stok) {
        return this.notFound('Stok kaydı bulunamadı');
      }

      // Stok hareketi oluştur
      const hareket = await StokHareketi.create({
        stok_id: id,
        tip: 'giris',
        miktar,
        aciklama
      });

      // Stok miktarını güncelle
      const guncelStok = await Stok.updateMiktar(id, miktar);

      return this.success({
        stok: guncelStok,
        hareket
      }, 'Stok girişi başarıyla kaydedildi');
    });
  }

  // Stok çıkış hareketi ekle
  static async stokCikis(req, res) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      const { miktar, aciklama } = req.body;

      const stok = await Stok.getById(id);
      if (!stok) {
        return this.notFound('Stok kaydı bulunamadı');
      }

      if (stok.miktar < miktar) {
        return this.error('Yeterli stok bulunmamaktadır', 400);
      }

      // Stok hareketi oluştur
      const hareket = await StokHareketi.create({
        stok_id: id,
        tip: 'cikis',
        miktar,
        aciklama
      });

      // Stok miktarını güncelle
      const guncelStok = await Stok.updateMiktar(id, -miktar);

      return this.success({
        stok: guncelStok,
        hareket
      }, 'Stok çıkışı başarıyla kaydedildi');
    });
  }

  // Stok sayım kaydı ekle
  static async stokSayim(req, res) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      const { miktar, aciklama } = req.body;

      const stok = await Stok.getById(id);
      if (!stok) {
        return this.notFound('Stok kaydı bulunamadı');
      }

      // Stok hareketi oluştur
      const hareket = await StokHareketi.create({
        stok_id: id,
        tip: 'sayim',
        miktar,
        aciklama
      });

      // Stok miktarını güncelle
      const guncelStok = await Stok.setMiktar(id, miktar);

      return this.success({
        stok: guncelStok,
        hareket
      }, 'Stok sayımı başarıyla kaydedildi');
    });
  }

  // Kritik stok seviyesindeki ürünleri listele
  static async getKritikStoklar(req, res) {
    return this.tryCatch(req, res, async () => {
      const stoklar = await Stok.getKritikStoklar();
      return this.success(stoklar);
    });
  }

  // Stok hareket geçmişini getir
  static async getStokHareketleri(req, res) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      
      const stok = await Stok.getById(id);
      if (!stok) {
        return this.notFound('Stok kaydı bulunamadı');
      }

      const hareketler = await StokHareketi.getByStokId(id);
      return this.success(hareketler);
    });
  }
}

module.exports = StokController; 