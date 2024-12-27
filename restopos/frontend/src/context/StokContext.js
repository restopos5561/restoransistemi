import React, { createContext, useContext, useState } from 'react';
import stokService from '../services/stokService';

const StokContext = createContext();

export const StokProvider = ({ children }) => {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState(null);
  const [stoklar, setStoklar] = useState([]);
  const [stokHareketleri, setStokHareketleri] = useState([]);
  const [stokUyarilar, setStokUyarilar] = useState([]);

  // Stokları getir
  const getStoklar = async () => {
    setYukleniyor(true);
    try {
      const data = await stokService.getStoklar();
      setStoklar(data);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Stok detayını getir
  const getStokDetay = async (urunId) => {
    setYukleniyor(true);
    try {
      const data = await stokService.getStokDetay(urunId);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Stok hareketi ekle
  const createStokHareket = async (hareketData) => {
    setYukleniyor(true);
    try {
      const data = await stokService.createStokHareket(hareketData);
      // Stokları güncelle
      await getStoklar();
      // Stok hareketlerini güncelle
      if (hareketData.urunId) {
        await getStokHareketler(hareketData.urunId);
      }
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Stok hareketlerini getir
  const getStokHareketler = async (urunId = null, params = {}) => {
    setYukleniyor(true);
    try {
      const data = await stokService.getStokHareketler(urunId, params);
      setStokHareketleri(data);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Stok sayımı kaydet
  const saveStokSayim = async (sayimData) => {
    setYukleniyor(true);
    try {
      const data = await stokService.saveStokSayim(sayimData);
      // Stokları güncelle
      await getStoklar();
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Stok uyarı limitlerini güncelle
  const updateStokLimitler = async (urunId, limitData) => {
    setYukleniyor(true);
    try {
      const data = await stokService.updateStokLimitler(urunId, limitData);
      // Stokları ve uyarıları güncelle
      await Promise.all([getStoklar(), getStokUyarilar()]);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Stok uyarılarını getir
  const getStokUyarilar = async () => {
    setYukleniyor(true);
    try {
      const data = await stokService.getStokUyarilar();
      setStokUyarilar(data);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Reçete işlemleri
  const receteIslemleri = {
    // Reçete oluştur
    createRecete: async (urunId, receteData) => {
      setYukleniyor(true);
      try {
        const data = await stokService.createRecete(urunId, receteData);
        return data;
      } catch (error) {
        setHata(error.message);
        throw error;
      } finally {
        setYukleniyor(false);
      }
    },

    // Reçete güncelle
    updateRecete: async (urunId, receteData) => {
      setYukleniyor(true);
      try {
        const data = await stokService.updateRecete(urunId, receteData);
        return data;
      } catch (error) {
        setHata(error.message);
        throw error;
      } finally {
        setYukleniyor(false);
      }
    },

    // Reçete getir
    getRecete: async (urunId) => {
      setYukleniyor(true);
      try {
        const data = await stokService.getRecete(urunId);
        return data;
      } catch (error) {
        setHata(error.message);
        throw error;
      } finally {
        setYukleniyor(false);
      }
    },

    // Reçete sil
    deleteRecete: async (urunId) => {
      setYukleniyor(true);
      try {
        const data = await stokService.deleteRecete(urunId);
        return data;
      } catch (error) {
        setHata(error.message);
        throw error;
      } finally {
        setYukleniyor(false);
      }
    }
  };

  // Toplu stok güncelleme
  const bulkUpdateStok = async (guncellemeler) => {
    setYukleniyor(true);
    try {
      const data = await stokService.bulkUpdateStok(guncellemeler);
      // Stokları güncelle
      await getStoklar();
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Stok raporu al
  const getStokRapor = async (params = {}) => {
    setYukleniyor(true);
    try {
      const data = await stokService.getStokRapor(params);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <StokContext.Provider
      value={{
        yukleniyor,
        hata,
        stoklar,
        stokHareketleri,
        stokUyarilar,
        getStoklar,
        getStokDetay,
        createStokHareket,
        getStokHareketler,
        saveStokSayim,
        updateStokLimitler,
        getStokUyarilar,
        receteIslemleri,
        bulkUpdateStok,
        getStokRapor
      }}
    >
      {children}
    </StokContext.Provider>
  );
};

export const useStok = () => {
  const context = useContext(StokContext);
  if (!context) {
    throw new Error('useStok must be used within a StokProvider');
  }
  return context;
};

export default StokContext; 