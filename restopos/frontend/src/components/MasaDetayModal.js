import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import SiparisModal from './SiparisModal';
import {
  UserIcon,
  ClockIcon,
  BanknotesIcon as CashIcon,
  XMarkIcon as XIcon,
  PrinterIcon,
  CreditCardIcon,
  ArrowPathIcon as RefreshIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  PlusIcon,
  MinusIcon,
  ArrowsRightLeftIcon as SwitchHorizontalIcon,
  ReceiptIcon
} from '@heroicons/react/24/outline';

const MasaDetayModal = ({ isOpen, onClose, masa, onDurumDegistir }) => {
  const [kisiSayisi, setKisiSayisi] = useState(masa?.kisiSayisi || 1);
  const [islemYapiliyor, setIslemYapiliyor] = useState(false);
  const [siparisModalAcik, setSiparisModalAcik] = useState(false);

  // Masa değiştiğinde kişi sayısını güncelle
  useEffect(() => {
    setKisiSayisi(masa?.kisiSayisi || 1);
  }, [masa]);

  // Kişi sayısı değiştirme işleyicileri
  const handleKisiArtir = () => setKisiSayisi(prev => prev + 1);
  const handleKisiAzalt = () => setKisiSayisi(prev => prev > 1 ? prev - 1 : 1);

  // Masa açma işlemi
  const handleMasaAc = async () => {
    try {
      setIslemYapiliyor(true);
      await onDurumDegistir(masa.id, 'dolu', kisiSayisi);
      setSiparisModalAcik(true);
    } catch (error) {
      console.error('Masa açma hatası:', error);
    } finally {
      setIslemYapiliyor(false);
    }
  };

  // Masa kapatma işlemi
  const handleMasaKapat = async () => {
    try {
      setIslemYapiliyor(true);
      await onDurumDegistir(masa.id, 'bos');
      onClose();
    } catch (error) {
      console.error('Masa kapatma hatası:', error);
    } finally {
      setIslemYapiliyor(false);
    }
  };

  // Aksiyon butonları
  const renderAksiyonButonlari = () => {
    if (masa?.durum === 'bos') {
      return (
        <button 
          className="btn btn-primary w-full flex items-center justify-center"
          onClick={handleMasaAc}
          disabled={islemYapiliyor}
        >
          {islemYapiliyor ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
              İşlem Yapılıyor...
            </>
          ) : (
            <>
              <PlusIcon className="w-5 h-5 mr-2" />
              Masayı Aç
            </>
          )}
        </button>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        <button 
          className="btn btn-secondary flex items-center justify-center"
          onClick={() => {/* TODO: Masayı taşı/birleştir */}}
          disabled={islemYapiliyor}
        >
          <SwitchHorizontalIcon className="w-5 h-5 mr-2" />
          Taşı/Birleştir
        </button>
        <button 
          className="btn btn-primary flex items-center justify-center"
          onClick={handleMasaKapat}
          disabled={islemYapiliyor}
        >
          <CashIcon className="w-5 h-5 mr-2" />
          Hesap Al
        </button>
      </div>
    );
  };

  // Footer butonları
  const renderFooterButonlari = () => {
    if (masa?.durum === 'bos') return null;

    return (
      <>
        <button 
          className="btn btn-secondary flex items-center"
          onClick={() => {/* TODO: Siparişleri görüntüle */}}
          disabled={islemYapiliyor}
        >
          <ReceiptIcon className="w-5 h-5 mr-2" />
          Siparişleri Görüntüle
        </button>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setSiparisModalAcik(true)}
          disabled={islemYapiliyor}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Yeni Sipariş
        </button>
      </>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Masa ${masa?.masaNo}`}
        size="md"
        footer={renderFooterButonlari()}
      >
        <div className="space-y-6">
          {/* Durum Bilgisi */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary-600">
              Durum
            </span>
            <span className={`text-sm font-medium capitalize
              ${masa?.durum === 'bos' ? 'text-secondary-600' : ''}
              ${masa?.durum === 'dolu' ? 'text-primary-600' : ''}
              ${masa?.durum === 'rezerve' ? 'text-accent-600' : ''}`}
            >
              {masa?.durum || 'bos'}
            </span>
          </div>

          {/* Kişi Sayısı */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-600">
              Kişi Sayısı
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleKisiAzalt}
                disabled={islemYapiliyor || masa?.durum === 'dolu'}
                className="p-2 rounded-lg text-secondary-400 hover:bg-secondary-50 
                  transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusIcon className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium text-secondary-900 w-12 text-center">
                {kisiSayisi}
              </span>
              <button
                onClick={handleKisiArtir}
                disabled={islemYapiliyor || masa?.durum === 'dolu'}
                className="p-2 rounded-lg text-secondary-400 hover:bg-secondary-50 
                  transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Masa Detayları */}
          {masa?.durum !== 'bos' && (
            <div className="space-y-4">
              {/* Toplam Tutar */}
              {masa?.toplamTutar && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-600">
                    Toplam Tutar
                  </span>
                  <span className="text-lg font-semibold text-primary-600">
                    ₺{masa.toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {/* Süre */}
              {masa?.baslangicZamani && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-600">
                    Açılış Zamanı
                  </span>
                  <span className="text-sm text-secondary-900">
                    {new Date(masa.baslangicZamani).toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="pt-4">
            {renderAksiyonButonlari()}
          </div>
        </div>
      </Modal>

      {/* Sipariş Modalı */}
      <SiparisModal
        isOpen={siparisModalAcik}
        onClose={() => setSiparisModalAcik(false)}
        masa={masa}
      />
    </>
  );
};

MasaDetayModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDurumDegistir: PropTypes.func.isRequired,
  masa: PropTypes.shape({
    id: PropTypes.number,
    masaNo: PropTypes.number,
    durum: PropTypes.oneOf(['bos', 'dolu', 'rezerve']),
    kisiSayisi: PropTypes.number,
    toplamTutar: PropTypes.number,
    baslangicZamani: PropTypes.string
  })
};

export default MasaDetayModal; 