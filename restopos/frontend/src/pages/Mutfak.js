import React, { useState, useEffect } from 'react';
import {
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  ArrowPathIcon as RefreshIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon as XIcon
} from '@heroicons/react/24/outline';
import MutfakSiparisKarti from '../components/MutfakSiparisKarti';
import { useSiparis } from '../context/SiparisContext';

const GORUNUM_TIPLERI = {
  GRID: 'grid',
  LIST: 'list'
};

const FILTRELER = {
  TUM: 'tum',
  BEKLEYEN: 'bekleyen',
  HAZIRLANAN: 'hazirlanan',
  TAMAMLANAN: 'tamamlanan'
};

const Mutfak = () => {
  const {
    yukleniyor,
    mutfakSiparisleri,
    getMutfakSiparisleri,
    updateSiparisDurum,
    sendBildirim
  } = useSiparis();

  const [gorunumTipi, setGorunumTipi] = useState(GORUNUM_TIPLERI.GRID);
  const [aktifFiltre, setAktifFiltre] = useState(FILTRELER.TUM);
  const [otomatikYenileme, setOtomatikYenileme] = useState(true);

  // Siparişleri yükle
  useEffect(() => {
    getMutfakSiparisleri();
  }, []);

  // Otomatik yenileme
  useEffect(() => {
    let interval;
    if (otomatikYenileme) {
      interval = setInterval(() => {
        getMutfakSiparisleri();
      }, 30000); // 30 saniyede bir yenile
    }
    return () => clearInterval(interval);
  }, [otomatikYenileme]);

  // Siparişleri filtrele
  const filtrelenenSiparisler = mutfakSiparisleri.filter(siparis => {
    switch (aktifFiltre) {
      case FILTRELER.BEKLEYEN:
        return siparis.durum === 'beklemede';
      case FILTRELER.HAZIRLANAN:
        return siparis.durum === 'hazirlaniyor';
      case FILTRELER.TAMAMLANAN:
        return siparis.durum === 'hazirlandi';
      default:
        return true;
    }
  });

  // Sipariş durumunu güncelle
  const handleDurumGuncelle = async (siparisId, yeniDurum) => {
    try {
      await updateSiparisDurum(siparisId, yeniDurum);
      await getMutfakSiparisleri();
    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata:', error);
    }
  };

  // Bildirim gönder
  const handleBildirimGonder = async (siparisId) => {
    try {
      await sendBildirim(siparisId);
    } catch (error) {
      console.error('Bildirim gönderilirken hata:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Başlık ve Kontroller */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mutfak Ekranı</h1>
        <div className="flex items-center space-x-4">
          {/* Görünüm Tipi */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setGorunumTipi(GORUNUM_TIPLERI.GRID)}
              className={`p-2 rounded-md ${
                gorunumTipi === GORUNUM_TIPLERI.GRID
                  ? 'bg-white shadow'
                  : 'hover:bg-gray-200'
              }`}
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setGorunumTipi(GORUNUM_TIPLERI.LIST)}
              className={`p-2 rounded-md ${
                gorunumTipi === GORUNUM_TIPLERI.LIST
                  ? 'bg-white shadow'
                  : 'hover:bg-gray-200'
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Filtreler */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5" />
            <select
              value={aktifFiltre}
              onChange={(e) => setAktifFiltre(e.target.value)}
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={FILTRELER.TUM}>Tüm Siparişler</option>
              <option value={FILTRELER.BEKLEYEN}>Bekleyen</option>
              <option value={FILTRELER.HAZIRLANAN}>Hazırlanan</option>
              <option value={FILTRELER.TAMAMLANAN}>Tamamlanan</option>
            </select>
          </div>

          {/* Otomatik Yenileme */}
          <button
            type="button"
            onClick={() => setOtomatikYenileme(!otomatikYenileme)}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              otomatikYenileme
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <RefreshIcon className={`w-5 h-5 mr-1 ${otomatikYenileme && 'animate-spin'}`} />
            Otomatik Yenileme
          </button>

          {/* Manuel Yenileme */}
          <button
            type="button"
            onClick={() => getMutfakSiparisleri()}
            disabled={yukleniyor}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <RefreshIcon className={`w-5 h-5 mr-1 ${yukleniyor && 'animate-spin'}`} />
            Yenile
          </button>
        </div>
      </div>

      {/* Siparişler */}
      {yukleniyor ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filtrelenenSiparisler.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 text-lg">Sipariş bulunmamaktadır.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          gorunumTipi === GORUNUM_TIPLERI.GRID
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}>
          {filtrelenenSiparisler.map(siparis => (
            <MutfakSiparisKarti
              key={siparis.id}
              siparis={siparis}
              onDurumGuncelle={handleDurumGuncelle}
              onBildirimGonder={handleBildirimGonder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Mutfak; 