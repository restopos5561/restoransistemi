import api from './api';

const masaService = {
  // Tüm masaları getir
  getMasalar: async () => {
    try {
      const response = await api.get('/masalar');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Masalar yüklenirken bir hata oluştu');
    }
  },

  // Tek bir masayı getir
  getMasaById: async (masaId) => {
    try {
      const response = await api.get(`/masalar/${masaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Masa detayı yüklenirken bir hata oluştu');
    }
  },

  // Yeni masa oluştur
  createMasa: async (masaData) => {
    try {
      const response = await api.post('/masalar', masaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Masa oluşturulurken bir hata oluştu');
    }
  },

  // Masa güncelle
  updateMasa: async (masaId, masaData) => {
    try {
      const response = await api.put(`/masalar/${masaId}`, masaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Masa güncellenirken bir hata oluştu');
    }
  },

  // Masa sil
  deleteMasa: async (masaId) => {
    try {
      const response = await api.delete(`/masalar/${masaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Masa silinirken bir hata oluştu');
    }
  },

  // Masa durumunu güncelle
  updateMasaDurum: async (masaId, durum, kisiSayisi = null) => {
    try {
      const response = await api.patch(`/masalar/${masaId}/durum`, { durum, kisiSayisi });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Masa durumu güncellenirken bir hata oluştu');
    }
  },

  // Masaları taşı/birleştir
  masalariTasi: async (kaynakMasaId, hedefMasaId) => {
    try {
      const response = await api.post('/masalar/tasi', {
        kaynakMasaId,
        hedefMasaId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Masalar taşınırken bir hata oluştu');
    }
  },

  // Masa hesabını kapat
  masaHesapKapat: async (masaId, odemeBilgileri) => {
    try {
      const response = await api.post(`/masalar/${masaId}/hesap-kapat`, odemeBilgileri);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Masa hesabı kapatılırken bir hata oluştu');
    }
  }
};

export default masaService; 