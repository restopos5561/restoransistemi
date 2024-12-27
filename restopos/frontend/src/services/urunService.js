import api from './api';

const urunService = {
  // Tüm ürünleri getir
  getUrunler: async (kategoriId = null) => {
    try {
      const response = await api.get(`/urunler${kategoriId ? `?kategoriId=${kategoriId}` : ''}`);
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Tek bir ürünü getir
  getUrunById: async (urunId) => {
    try {
      const response = await api.get(`/urunler/${urunId}`);
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Yeni ürün oluştur
  createUrun: async (urunData) => {
    try {
      const formData = new FormData();
      
      // Dosya varsa ekle
      if (urunData.resim) {
        formData.append('resim', urunData.resim);
        delete urunData.resim;
      }
      
      // Diğer verileri ekle
      Object.keys(urunData).forEach(key => {
        formData.append(key, urunData[key]);
      });

      const response = await api.post('/urunler', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Ürün güncelle
  updateUrun: async (urunId, urunData) => {
    try {
      const formData = new FormData();
      
      // Dosya varsa ekle
      if (urunData.resim) {
        formData.append('resim', urunData.resim);
        delete urunData.resim;
      }
      
      // Diğer verileri ekle
      Object.keys(urunData).forEach(key => {
        formData.append(key, urunData[key]);
      });

      const response = await api.put(`/urunler/${urunId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Ürün sil
  deleteUrun: async (urunId) => {
    try {
      const response = await api.delete(`/urunler/${urunId}`);
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Ürün durumunu güncelle (aktif/pasif)
  updateUrunDurum: async (urunId, durum) => {
    try {
      const response = await api.patch(`/urunler/${urunId}/durum`, { durum });
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Ürün kategorileri
  getKategoriler: async () => {
    try {
      const response = await api.get('/urunler/kategoriler');
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Yeni kategori oluştur
  createKategori: async (kategoriData) => {
    try {
      const response = await api.post('/urunler/kategoriler', kategoriData);
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Kategori güncelle
  updateKategori: async (kategoriId, kategoriData) => {
    try {
      const response = await api.put(`/urunler/kategoriler/${kategoriId}`, kategoriData);
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Kategori sil
  deleteKategori: async (kategoriId) => {
    try {
      const response = await api.delete(`/urunler/kategoriler/${kategoriId}`);
      return response.data;
    } catch (error) {
      throw urunService.handleError(error);
    }
  },

  // Hata yönetimi
  handleError: (error) => {
    if (error.response) {
      // Server kaynaklı hata
      const message = error.response.data.message || 'Bir hata oluştu';
      throw new Error(message);
    } else if (error.request) {
      // İstek yapılamadı
      throw new Error('Sunucuya ulaşılamıyor');
    } else {
      // İstek oluşturulurken hata
      throw new Error('İstek oluşturulamadı');
    }
  }
};

export default urunService; 