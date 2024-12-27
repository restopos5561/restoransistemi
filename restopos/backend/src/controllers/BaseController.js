class BaseController {
  // Standart başarılı yanıt formatı
  static success(data = null, message = 'İşlem başarılı', statusCode = 200) {
    return {
      status: 'success',
      message,
      data,
      statusCode
    };
  }

  // Standart hata yanıt formatı
  static error(message = 'Bir hata oluştu', statusCode = 500, errors = null) {
    return {
      status: 'error',
      message,
      errors,
      statusCode
    };
  }

  // Sayfalama için yardımcı metod
  static paginate(data, sayfa, toplam_kayit, limit) {
    return {
      data,
      sayfa: parseInt(sayfa),
      toplam_kayit: parseInt(toplam_kayit),
      toplam_sayfa: Math.ceil(toplam_kayit / limit)
    };
  }

  // Validasyon hatası yanıt formatı
  static validationError(errors) {
    return this.error('Validasyon hatası', 422, errors);
  }

  // Kayıt bulunamadı yanıt formatı
  static notFound(message = 'Kayıt bulunamadı') {
    return this.error(message, 404);
  }

  // Yetkilendirme hatası yanıt formatı
  static unauthorized(message = 'Bu işlem için yetkiniz yok') {
    return this.error(message, 401);
  }

  // Yardımcı metodlar
  static async tryCatch(req, res, callback) {
    try {
      const result = await callback();
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json(
        this.error(error.message)
      );
    }
  }

  // Liste endpoint'leri için yardımcı metod
  static async handleList(req, res, Model, filters = {}) {
    return this.tryCatch(req, res, async () => {
      const { sayfa = 1, limit = 10, ...otherFilters } = req.query;
      const offset = (sayfa - 1) * limit;
      
      const data = await Model.getAll({
        ...otherFilters,
        ...filters,
        limit,
        offset
      });
      
      const total = await Model.count(otherFilters);
      
      return this.success(
        this.paginate(data, sayfa, total, limit)
      );
    });
  }

  // Tekil kayıt endpoint'leri için yardımcı metod
  static async handleGet(req, res, Model) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      const data = await Model.getById(id);
      
      if (!data) {
        return this.notFound();
      }
      
      return this.success(data);
    });
  }

  // Oluşturma endpoint'leri için yardımcı metod
  static async handleCreate(req, res, Model) {
    return this.tryCatch(req, res, async () => {
      const data = await Model.create(req.body);
      return this.success(data, 'Kayıt başarıyla oluşturuldu', 201);
    });
  }

  // Güncelleme endpoint'leri için yardımcı metod
  static async handleUpdate(req, res, Model) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      const data = await Model.update(id, req.body);
      
      if (!data) {
        return this.notFound();
      }
      
      return this.success(data, 'Kayıt başarıyla güncellendi');
    });
  }

  // Silme endpoint'leri için yardımcı metod
  static async handleDelete(req, res, Model) {
    return this.tryCatch(req, res, async () => {
      const { id } = req.params;
      const data = await Model.delete(id);
      
      if (!data) {
        return this.notFound();
      }
      
      return this.success(null, 'Kayıt başarıyla silindi');
    });
  }
}

module.exports = BaseController; 