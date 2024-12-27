import React from 'react';
import {
  UserIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon as XIcon,
  BellIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  ArrowPathIcon as RefreshIcon
} from '@heroicons/react/24/outline';

const SIPARIS_DURUMLARI = {
  BEKLEMEDE: 'beklemede',
  HAZIRLANIYOR: 'hazirlaniyor',
  HAZIRLANDI: 'hazirlandi',
  IPTAL: 'iptal'
};

const MutfakSiparisKarti = ({
  siparis,
  onDurumGuncelle,
  onBildirimGonder
}) => {
  // Sipariş süresini hesapla
  const getSiparisSuresi = () => {
    const siparisZamani = new Date(siparis.tarih);
    const simdikiZaman = new Date();
    const farkDakika = Math.floor((simdikiZaman - siparisZamani) / 1000 / 60);
    
    if (farkDakika < 1) return 'Yeni';
    if (farkDakika < 60) return `${farkDakika} dk`;
    return `${Math.floor(farkDakika / 60)} sa ${farkDakika % 60} dk`;
  };

  // Durum rengini belirle
  const getDurumRengi = () => {
    switch (siparis.durum) {
      case SIPARIS_DURUMLARI.BEKLEMEDE:
        return 'bg-yellow-100 text-yellow-800';
      case SIPARIS_DURUMLARI.HAZIRLANIYOR:
        return 'bg-blue-100 text-blue-800';
      case SIPARIS_DURUMLARI.HAZIRLANDI:
        return 'bg-green-100 text-green-800';
      case SIPARIS_DURUMLARI.IPTAL:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Durum metnini belirle
  const getDurumMetni = () => {
    switch (siparis.durum) {
      case SIPARIS_DURUMLARI.BEKLEMEDE:
        return 'Beklemede';
      case SIPARIS_DURUMLARI.HAZIRLANIYOR:
        return 'Hazırlanıyor';
      case SIPARIS_DURUMLARI.HAZIRLANDI:
        return 'Hazırlandı';
      case SIPARIS_DURUMLARI.IPTAL:
        return 'İptal';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${siparis.acil ? 'border-red-500' : 'border-gray-200'}`}>
      {/* Başlık */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Masa {siparis.masaNumara}
            {siparis.paketServis && ' - Paket Servis'}
          </h3>
          <p className="text-sm text-gray-500">
            Sipariş No: #{siparis.id}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-sm text-gray-500">
            <ClockIcon className="w-4 h-4 mr-1" />
            {getSiparisSuresi()}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDurumRengi()}`}>
            {getDurumMetni()}
          </span>
        </div>
      </div>

      {/* Ürünler */}
      <div className="space-y-2 mb-4">
        {siparis.urunler.map((urun, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 rounded bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <span className="font-medium">{urun.adet}x</span>
              <span>{urun.ad}</span>
            </div>
            {urun.notlar && (
              <span className="text-sm text-gray-500 italic">
                {urun.notlar}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Notlar */}
      {siparis.notlar && (
        <div className="mb-4 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
          <p className="font-medium">Notlar:</p>
          <p>{siparis.notlar}</p>
        </div>
      )}

      {/* Butonlar */}
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          {siparis.durum !== SIPARIS_DURUMLARI.HAZIRLANDI && (
            <button
              type="button"
              onClick={() => onDurumGuncelle(siparis.id, SIPARIS_DURUMLARI.HAZIRLANDI)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              <CheckIcon className="w-5 h-5 mr-1" />
              Hazırlandı
            </button>
          )}
          {siparis.durum === SIPARIS_DURUMLARI.BEKLEMEDE && (
            <button
              type="button"
              onClick={() => onDurumGuncelle(siparis.id, SIPARIS_DURUMLARI.HAZIRLANIYOR)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <RefreshIcon className="w-5 h-5 mr-1" />
              Hazırlanıyor
            </button>
          )}
          {siparis.durum !== SIPARIS_DURUMLARI.IPTAL && (
            <button
              type="button"
              onClick={() => onDurumGuncelle(siparis.id, SIPARIS_DURUMLARI.IPTAL)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              <XIcon className="w-5 h-5 mr-1" />
              İptal
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onBildirimGonder(siparis.id)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <BellIcon className="w-5 h-5 mr-1" />
          Bildirim
        </button>
      </div>
    </div>
  );
};

export default MutfakSiparisKarti; 