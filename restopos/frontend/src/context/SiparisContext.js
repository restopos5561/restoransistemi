import React, { createContext, useContext, useState } from 'react';
import siparisService from '../services/siparisService';

const SiparisContext = createContext();

export const SiparisProvider = ({ children }) => {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState(null);
  const [mutfakSiparisleri, setMutfakSiparisleri] = useState([]);

  // Siparişleri getir
  const getSiparisler = async () => {
    setYukleniyor(true);
    try {
      const data = await siparisService.getSiparisler();
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Sipariş oluştur
  const createSiparis = async (siparisData) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.createSiparis(siparisData);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Sipariş güncelle
  const updateSiparis = async (siparisId, siparisData) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.updateSiparis(siparisId, siparisData);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Sipariş durumu güncelle
  const updateSiparisDurum = async (siparisId, yeniDurum) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.updateSiparisDurum(siparisId, yeniDurum);
      // Mutfak siparişlerini güncelle
      await getMutfakSiparisleri();
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Sipariş iptal et
  const cancelSiparis = async (siparisId, iptalNedeni) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.cancelSiparis(siparisId, iptalNedeni);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Sipariş iade et
  const refundSiparis = async (siparisId, iadeData) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.refundSiparis(siparisId, iadeData);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Kısmi iade işlemi
  const partialRefund = async (siparisId, iadeData) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.partialRefund(siparisId, iadeData);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // İptal/İade işlemi
  const handleIptalIade = async (siparisId, islemData) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.handleIptalIade(siparisId, islemData);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Ürün ekle
  const addUrun = async (siparisId, urunData) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.addUrun(siparisId, urunData);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Ürün kaldır
  const removeUrun = async (siparisId, urunId) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.removeUrun(siparisId, urunId);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Mutfak siparişlerini getir
  const getMutfakSiparisleri = async () => {
    setYukleniyor(true);
    try {
      const data = await siparisService.getMutfakSiparisleri();
      setMutfakSiparisleri(data);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Sipariş detaylarını getir
  const getSiparisDetay = async (siparisId) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.getSiparisDetay(siparisId);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Sipariş düzenle
  const editSiparis = async (siparisId, siparisData) => {
    setYukleniyor(true);
    try {
      const data = await siparisService.editSiparis(siparisId, siparisData);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  };

  // Bildirim gönder
  const sendBildirim = async (siparisId) => {
    try {
      const data = await siparisService.sendBildirim(siparisId);
      return data;
    } catch (error) {
      setHata(error.message);
      throw error;
    }
  };

  return (
    <SiparisContext.Provider
      value={{
        yukleniyor,
        hata,
        getSiparisler,
        createSiparis,
        updateSiparis,
        updateSiparisDurum,
        cancelSiparis,
        refundSiparis,
        partialRefund,
        handleIptalIade,
        addUrun,
        removeUrun,
        getMutfakSiparisleri,
        getSiparisDetay,
        editSiparis,
        mutfakSiparisleri
      }}
    >
      {children}
    </SiparisContext.Provider>
  );
};

export const useSiparis = () => {
  const context = useContext(SiparisContext);
  if (!context) {
    throw new Error('useSiparis must be used within a SiparisProvider');
  }
  return context;
};

export default SiparisContext; 