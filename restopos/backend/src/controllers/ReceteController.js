const BaseController = require('./BaseController');
const Recete = require('../models/Recete');
const Urun = require('../models/Urun');
const Stok = require('../models/Stok');

class ReceteController extends BaseController {
  // Tüm reçeteleri listele
  static async getAll(req, res) {
    try {
      const {
        sayfa = 1,
        limit = 20,
        siralama = 'olusturma_tarihi',
        yon = 'DESC',
        urun_id,
        aktif,
        arama
      } = req.query;

      // Validasyon
      if (siralama && !['olusturma_tarihi', 'guncelleme_tarihi'].includes(siralama)) {
        return res.status(422).json(
          this.validationError({
            siralama: 'Geçersiz sıralama alanı'
          })
        );
      }

      const filters = {
        sayfa: parseInt(sayfa),
        limit: parseInt(limit),
        siralama,
        yon: yon.toUpperCase(),
        urun_id,
        aktif: aktif === 'true',
        arama
      };

      const { data, toplam_kayit } = await Recete.getAll(filters);
      
      return res.json(
        this.success(
          this.paginate(data, sayfa, toplam_kayit, limit)
        )
      );
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Belirli bir reçeteyi getir
  static async getById(req, res) {
    try {
      const recete = await Recete.getById(req.params.id);
      if (!recete) {
        return res.status(404).json(this.notFound('Reçete bulunamadı'));
      }
      return res.json(this.success(recete));
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Yeni reçete oluştur
  static async create(req, res) {
    try {
      const {
        urun_id,
        malzemeler,
        hazirlama_suresi,
        pisirme_suresi,
        porsiyon,
        notlar
      } = req.body;

      // Validasyon
      if (!urun_id || !malzemeler || !malzemeler.length) {
        return res.status(422).json(
          this.validationError({
            urun_id: !urun_id ? 'Ürün seçimi zorunludur' : null,
            malzemeler: !malzemeler || !malzemeler.length ? 'En az bir malzeme eklenmelidir' : null
          })
        );
      }

      // Ürün kontrolü
      const urun = await Urun.getById(urun_id);
      if (!urun) {
        return res.status(404).json(this.notFound('Ürün bulunamadı'));
      }

      // Malzeme kontrolü
      for (const malzeme of malzemeler) {
        const { stok_id, miktar, birim } = malzeme;

        if (!stok_id || !miktar || !birim) {
          return res.status(422).json(
            this.validationError({
              malzemeler: 'Tüm malzemeler için stok, miktar ve birim belirtilmelidir'
            })
          );
        }

        // Stok kontrolü
        const stok = await Stok.getById(stok_id);
        if (!stok) {
          return res.status(404).json(this.notFound(`${stok_id} ID'li stok bulunamadı`));
        }

        // Miktar kontrolü
        if (miktar <= 0) {
          return res.status(422).json(
            this.validationError({
              malzemeler: 'Malzeme miktarı 0\'dan büyük olmalıdır'
            })
          );
        }
      }

      const yeniRecete = await Recete.create({
        urun_id,
        malzemeler,
        hazirlama_suresi,
        pisirme_suresi,
        porsiyon,
        notlar
      });

      return res.status(201).json(
        this.success(yeniRecete, 'Reçete başarıyla oluşturuldu')
      );
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Reçete güncelle
  static async update(req, res) {
    try {
      const { id } = req.params;
      const {
        malzemeler,
        hazirlama_suresi,
        pisirme_suresi,
        porsiyon,
        notlar,
        aktif
      } = req.body;

      // Reçete kontrolü
      const mevcutRecete = await Recete.getById(id);
      if (!mevcutRecete) {
        return res.status(404).json(this.notFound('Reçete bulunamadı'));
      }

      // Malzeme kontrolü
      if (malzemeler && malzemeler.length) {
        for (const malzeme of malzemeler) {
          const { stok_id, miktar, birim } = malzeme;

          if (!stok_id || !miktar || !birim) {
            return res.status(422).json(
              this.validationError({
                malzemeler: 'Tüm malzemeler için stok, miktar ve birim belirtilmelidir'
              })
            );
          }

          // Stok kontrolü
          const stok = await Stok.getById(stok_id);
          if (!stok) {
            return res.status(404).json(this.notFound(`${stok_id} ID'li stok bulunamadı`));
          }

          // Miktar kontrolü
          if (miktar <= 0) {
            return res.status(422).json(
              this.validationError({
                malzemeler: 'Malzeme miktarı 0\'dan büyük olmalıdır'
              })
            );
          }
        }
      }

      const guncelRecete = await Recete.update(id, {
        malzemeler,
        hazirlama_suresi,
        pisirme_suresi,
        porsiyon,
        notlar,
        aktif
      });

      return res.json(
        this.success(guncelRecete, 'Reçete başarıyla güncellendi')
      );
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Reçete sil (soft delete)
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Reçete kontrolü
      const recete = await Recete.getById(id);
      if (!recete) {
        return res.status(404).json(this.notFound('Reçete bulunamadı'));
      }

      await Recete.update(id, { aktif: false });

      return res.json(
        this.success(null, 'Reçete başarıyla silindi')
      );
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Ürüne göre reçete getir
  static async getByUrun(req, res) {
    try {
      const { urun_id } = req.params;

      // Ürün kontrolü
      const urun = await Urun.getById(urun_id);
      if (!urun) {
        return res.status(404).json(this.notFound('Ürün bulunamadı'));
      }

      const recete = await Recete.getByUrun(urun_id);
      if (!recete) {
        return res.status(404).json(this.notFound('Bu ürüne ait reçete bulunamadı'));
      }

      return res.json(this.success(recete));
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Reçete malzeme maliyeti hesapla
  static async getMaliyet(req, res) {
    try {
      const { id } = req.params;

      // Reçete kontrolü
      const recete = await Recete.getById(id);
      if (!recete) {
        return res.status(404).json(this.notFound('Reçete bulunamadı'));
      }

      const maliyet = await Recete.hesaplaMaliyet(id);
      return res.json(this.success(maliyet));
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Reçete kopyala
  static async kopyala(req, res) {
    try {
      const { id } = req.params;
      const { yeni_urun_id } = req.body;

      // Reçete kontrolü
      const kaynak = await Recete.getById(id);
      if (!kaynak) {
        return res.status(404).json(this.notFound('Kaynak reçete bulunamadı'));
      }

      // Hedef ürün kontrolü
      const hedefUrun = await Urun.getById(yeni_urun_id);
      if (!hedefUrun) {
        return res.status(404).json(this.notFound('Hedef ürün bulunamadı'));
      }

      // Hedef üründe reçete var mı kontrolü
      const mevcutRecete = await Recete.getByUrun(yeni_urun_id);
      if (mevcutRecete) {
        return res.status(400).json(
          this.error('Hedef ürüne ait reçete zaten mevcut', 400)
        );
      }

      const yeniRecete = await Recete.kopyala(id, yeni_urun_id);
      return res.status(201).json(
        this.success(yeniRecete, 'Reçete başarıyla kopyalandı')
      );
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Reçete malzemelerini güncelle
  static async updateMalzemeler(req, res) {
    try {
      const { id } = req.params;
      const { malzemeler } = req.body;

      // Reçete kontrolü
      const mevcutRecete = await Recete.getById(id);
      if (!mevcutRecete) {
        return res.status(404).json(this.notFound('Reçete bulunamadı'));
      }

      // Malzeme kontrolü
      if (!malzemeler || !malzemeler.length) {
        return res.status(422).json(
          this.validationError({
            malzemeler: 'En az bir malzeme eklenmelidir'
          })
        );
      }

      // Malzemeleri kontrol et
      for (const malzeme of malzemeler) {
        const { stok_id, miktar, birim } = malzeme;

        if (!stok_id || !miktar || !birim) {
          return res.status(422).json(
            this.validationError({
              malzemeler: 'Tüm malzemeler için stok, miktar ve birim belirtilmelidir'
            })
          );
        }

        // Stok kontrolü
        const stok = await Stok.getById(stok_id);
        if (!stok) {
          return res.status(404).json(this.notFound(`${stok_id} ID'li stok bulunamadı`));
        }

        // Miktar kontrolü
        if (miktar <= 0) {
          return res.status(422).json(
            this.validationError({
              malzemeler: 'Malzeme miktarı 0\'dan büyük olmalıdır'
            })
          );
        }
      }

      // Malzemeleri güncelle
      const guncelRecete = await Recete.updateMalzemeler(id, malzemeler);

      return res.json(
        this.success(guncelRecete, 'Reçete malzemeleri başarıyla güncellendi')
      );
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Reçete durumunu güncelle
  static async updateDurum(req, res) {
    try {
      const { id } = req.params;
      const { durum } = req.body;

      // Reçete kontrolü
      const mevcutRecete = await Recete.getById(id);
      if (!mevcutRecete) {
        return res.status(404).json(this.notFound('Reçete bulunamadı'));
      }

      // Durum kontrolü
      const gecerliDurumlar = ['aktif', 'pasif', 'taslak'];
      if (!gecerliDurumlar.includes(durum)) {
        return res.status(422).json(
          this.validationError({
            durum: 'Geçersiz durum değeri. Geçerli değerler: ' + gecerliDurumlar.join(', ')
          })
        );
      }

      // Durumu güncelle
      const guncelRecete = await Recete.updateDurum(id, durum);

      return res.json(
        this.success(guncelRecete, 'Reçete durumu başarıyla güncellendi')
      );
    } catch (error) {
      return res.status(500).json(this.error(error.message));
    }
  }

  // Kategoriye göre reçeteleri getir
  static async getByKategori(req, res) {
    try {
      const { kategoriId } = req.params;
      const receteler = await Recete.findAll({
        include: [{
          model: Urun,
          where: { kategori_id: kategoriId }
        }],
        where: { aktif: true }
      });
      return res.json(this.success(receteler));
    } catch (error) {
      return res.status(500).json(this.error(`Kategori reçeteleri getirilirken hata oluştu: ${error.message}`));
    }
  }

  // Malzemeye göre reçeteleri getir
  static async getByMalzeme(req, res) {
    try {
      const { malzemeId } = req.params;
      const receteler = await Recete.findAll({
        include: [{
          model: Stok,
          where: { id: malzemeId }
        }],
        where: { aktif: true }
      });
      return res.json(this.success(receteler));
    } catch (error) {
      return res.status(500).json(this.error(`Malzeme reçeteleri getirilirken hata oluştu: ${error.message}`));
    }
  }

  // Reçete geçmişini getir
  static async getGecmis(req, res) {
    try {
      const { id } = req.params;
      const gecmis = await Recete.findOne({
        where: { id },
        include: [{
          model: ReceteGecmis,
          order: [['olusturma_tarihi', 'DESC']]
        }]
      });
      
      if (!gecmis) {
        return res.status(404).json(this.notFound('Reçete bulunamadı'));
      }
      
      return res.json(this.success(gecmis.ReceteGecmis));
    } catch (error) {
      return res.status(500).json(this.error(`Reçete geçmişi getirilirken hata oluştu: ${error.message}`));
    }
  }
}

module.exports = ReceteController; 