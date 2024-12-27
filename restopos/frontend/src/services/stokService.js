import api from './api';

const stokService = {
  // Stok listesini getir
  getStoklar: async () => {
    try {
      const response = await api.get('/stoklar');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Stoklar yüklenirken bir hata oluştu');
    }
  },

  // Stok detayını getir
  getStokDetay: async (urunId) => {
    try {
      const response = await api.get(`/stoklar/${urunId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Stok detayı yüklenirken bir hata oluştu');
    }
  },

  // Stok hareketi ekle
  createStokHareket: async (hareketData) => {
    try {
      const response = await api.post('/stoklar/hareket', hareketData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Stok hareketi oluşturulurken bir hata oluştu');
    }
  },

  // Stok hareketlerini getir
  getStokHareketler: async (urunId = null, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = urunId 
        ? `/stoklar/${urunId}/hareketler${queryParams ? `?${queryParams}` : ''}`
        : `/stoklar/hareketler${queryParams ? `?${queryParams}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Stok hareketleri yüklenirken bir hata oluştu');
    }
  },

  // Stok sayımı kaydet
  saveStokSayim: async (sayimData) => {
    try {
      const response = await api.post('/stoklar/sayim', sayimData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Stok sayımı kaydedilirken bir hata oluştu');
    }
  },

  // Stok uyarı limitlerini güncelle
  updateStokLimitler: async (urunId, limitData) => {
    try {
      const response = await api.put(`/stoklar/${urunId}/limitler`, limitData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Stok limitleri güncellenirken bir hata oluştu');
    }
  },

  // Stok uyarılarını getir
  getStokUyarilar: async () => {
    try {
      const response = await api.get('/stoklar/uyarilar');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Stok uyarıları yüklenirken bir hata oluştu');
    }
  },

  // Reçete tanımla
  createRecete: async (urunId, receteData) => {
    try {
      const response = await api.post(`/stoklar/${urunId}/recete`, receteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Reçete oluşturulurken bir hata oluştu');
    }
  },

  // Reçete güncelle
  updateRecete: async (urunId, receteData) => {
    try {
      const response = await api.put(`/stoklar/${urunId}/recete`, receteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Reçete güncellenirken bir hata oluştu');
    }
  },

  // Reçete getir
  getRecete: async (urunId) => {
    try {
      const response = await api.get(`/stoklar/${urunId}/recete`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Reçete yüklenirken bir hata oluştu');
    }
  },

  // Reçete sil
  deleteRecete: async (urunId) => {
    try {
      const response = await api.delete(`/stoklar/${urunId}/recete`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Reçete silinirken bir hata oluştu');
    }
  },

  // Toplu stok güncelleme
  bulkUpdateStok: async (guncellemeler) => {
    try {
      const response = await api.post('/stoklar/bulk-update', guncellemeler);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Toplu stok güncellenirken bir hata oluştu');
    }
  },

  // Stok raporu al
  getStokRapor: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/stoklar/rapor${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Stok raporu alınırken bir hata oluştu');
    }
  }
};

export default stokService; 