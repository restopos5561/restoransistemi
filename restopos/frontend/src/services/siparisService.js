import api from './api';

const siparisService = {
  // Siparişleri getir
  getSiparisler: async () => {
    try {
      const response = await api.get('/siparisler');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Siparişler yüklenirken bir hata oluştu');
    }
  },

  // Sipariş oluştur
  createSiparis: async (siparisData) => {
    try {
      const response = await api.post('/siparisler', siparisData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Sipariş oluşturulurken bir hata oluştu');
    }
  },

  // Sipariş güncelle
  updateSiparis: async (siparisId, siparisData) => {
    try {
      const response = await api.put(`/siparisler/${siparisId}`, siparisData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Sipariş güncellenirken bir hata oluştu');
    }
  },

  // Sipariş durumu güncelle
  updateSiparisDurum: async (siparisId, yeniDurum) => {
    try {
      const response = await api.put(`/siparisler/${siparisId}/durum`, { durum: yeniDurum });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Sipariş durumu güncellenirken bir hata oluştu');
    }
  },

  // Sipariş iptal et
  cancelSiparis: async (siparisId, iptalNedeni) => {
    try {
      const response = await api.post(`/siparisler/${siparisId}/iptal`, { iptalNedeni });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Sipariş iptal edilirken bir hata oluştu');
    }
  },

  // Sipariş iade et
  refundSiparis: async (siparisId, iadeData) => {
    try {
      const response = await api.post(`/siparisler/${siparisId}/iade`, iadeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Sipariş iade edilirken bir hata oluştu');
    }
  },

  // Kısmi iade işlemi
  partialRefund: async (siparisId, iadeData) => {
    try {
      const response = await api.post(`/siparisler/${siparisId}/kismi-iade`, iadeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Kısmi iade işlemi sırasında bir hata oluştu');
    }
  },

  // İptal/İade işlemi
  handleIptalIade: async (siparisId, islemData) => {
    const { islemTipi, ...data } = islemData;
    try {
      let response;

      if (islemTipi === 'iptal') {
        response = await api.post(`/siparisler/${siparisId}/iptal`, data);
      } else if (islemTipi === 'iade') {
        if (data.iadeOrani === 100) {
          response = await api.post(`/siparisler/${siparisId}/iade`, data);
        } else {
          response = await api.post(`/siparisler/${siparisId}/kismi-iade`, data);
        }
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || `${islemTipi === 'iptal' ? 'İptal' : 'İade'} işlemi sırasında bir hata oluştu`);
    }
  },

  // Ürün ekle
  addUrun: async (siparisId, urunData) => {
    try {
      const response = await api.post(`/siparisler/${siparisId}/urunler`, urunData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ürün eklenirken bir hata oluştu');
    }
  },

  // Ürün kaldır
  removeUrun: async (siparisId, urunId) => {
    try {
      const response = await api.delete(`/siparisler/${siparisId}/urunler/${urunId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Ürün kaldırılırken bir hata oluştu');
    }
  },

  // Mutfak siparişlerini getir
  getMutfakSiparisleri: async () => {
    try {
      const response = await api.get('/mutfak/aktif');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Mutfak siparişleri yüklenirken bir hata oluştu');
    }
  },

  // Sipariş detaylarını getir
  getSiparisDetay: async (siparisId) => {
    try {
      const response = await api.get(`/siparisler/${siparisId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Sipariş detayları yüklenirken bir hata oluştu');
    }
  },

  // Sipariş düzenle
  editSiparis: async (siparisId, siparisData) => {
    try {
      const response = await api.put(`/siparisler/${siparisId}/duzenle`, siparisData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Sipariş düzenlenirken bir hata oluştu');
    }
  },

  // Hızlı satış oluştur
  createHizliSatis: async (satisData) => {
    try {
      const response = await api.post('/hizli-satis', satisData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Hızlı satış oluşturulurken bir hata oluştu');
    }
  },

  // Paket sipariş oluştur
  createPaketSiparis: async (siparisData) => {
    try {
      const response = await api.post('/paket-siparis', siparisData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Paket siparişi oluşturulurken bir hata oluştu');
    }
  },

  // Bildirim gönder
  sendBildirim: async (siparisId) => {
    try {
      const response = await api.post(`/siparisler/${siparisId}/bildirim`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Bildirim gönderilirken bir hata oluştu');
    }
  }
};

export default siparisService; 