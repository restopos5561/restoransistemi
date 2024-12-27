import React, { createContext, useContext, useState, useCallback } from 'react';
import urunService from '../services/urunService';

const UrunContext = createContext();

export const useUrun = () => {
  const context = useContext(UrunContext);
  if (!context) {
    throw new Error('useUrun hook must be used within a UrunProvider');
  }
  return context;
};

export const UrunProvider = ({ children }) => {
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState(null);
  const [seciliKategori, setSeciliKategori] = useState(null);

  // Ürünleri getir
  const getUrunler = useCallback(async (kategoriId = null) => {
    try {
      setYukleniyor(true);
      setHata(null);
      const data = await urunService.getUrunler(kategoriId);
      setUrunler(data);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Kategorileri getir
  const getKategoriler = useCallback(async () => {
    try {
      setYukleniyor(true);
      setHata(null);
      const data = await urunService.getKategoriler();
      setKategoriler(data);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Yeni ürün oluştur
  const createUrun = useCallback(async (urunData) => {
    try {
      setYukleniyor(true);
      setHata(null);
      const yeniUrun = await urunService.createUrun(urunData);
      setUrunler(prev => [...prev, yeniUrun]);
      return yeniUrun;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Ürün güncelle
  const updateUrun = useCallback(async (urunId, urunData) => {
    try {
      setYukleniyor(true);
      setHata(null);
      const guncelUrun = await urunService.updateUrun(urunId, urunData);
      setUrunler(prev => 
        prev.map(urun => urun.id === urunId ? guncelUrun : urun)
      );
      return guncelUrun;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Ürün sil
  const deleteUrun = useCallback(async (urunId) => {
    try {
      setYukleniyor(true);
      setHata(null);
      await urunService.deleteUrun(urunId);
      setUrunler(prev => prev.filter(urun => urun.id !== urunId));
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Ürün durumu güncelle
  const updateUrunDurum = useCallback(async (urunId, durum) => {
    try {
      setYukleniyor(true);
      setHata(null);
      const guncelUrun = await urunService.updateUrunDurum(urunId, durum);
      setUrunler(prev => 
        prev.map(urun => urun.id === urunId ? guncelUrun : urun)
      );
      return guncelUrun;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Yeni kategori oluştur
  const createKategori = useCallback(async (kategoriData) => {
    try {
      setYukleniyor(true);
      setHata(null);
      const yeniKategori = await urunService.createKategori(kategoriData);
      setKategoriler(prev => [...prev, yeniKategori]);
      return yeniKategori;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Kategori güncelle
  const updateKategori = useCallback(async (kategoriId, kategoriData) => {
    try {
      setYukleniyor(true);
      setHata(null);
      const guncelKategori = await urunService.updateKategori(kategoriId, kategoriData);
      setKategoriler(prev => 
        prev.map(kategori => kategori.id === kategoriId ? guncelKategori : kategori)
      );
      return guncelKategori;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }, []);

  // Kategori sil
  const deleteKategori = useCallback(async (kategoriId) => {
    try {
      setYukleniyor(true);
      setHata(null);
      await urunService.deleteKategori(kategoriId);
      setKategoriler(prev => prev.filter(kategori => kategori.id !== kategoriId));
      if (seciliKategori?.id === kategoriId) {
        setSeciliKategori(null);
      }
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }, [seciliKategori]);

  const value = {
    urunler,
    kategoriler,
    yukleniyor,
    hata,
    seciliKategori,
    setSeciliKategori,
    getUrunler,
    getKategoriler,
    createUrun,
    updateUrun,
    deleteUrun,
    updateUrunDurum,
    createKategori,
    updateKategori,
    deleteKategori
  };

  return (
    <UrunContext.Provider value={value}>
      {children}
    </UrunContext.Provider>
  );
};

export default UrunContext; 