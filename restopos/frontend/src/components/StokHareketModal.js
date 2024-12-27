import React, { useState } from 'react';
import {
  XMarkIcon as XIcon,
  ArrowUpTrayIcon as UploadIcon,
  ArrowDownTrayIcon as DownloadIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import Modal from './Modal';

const HAREKET_TIPLERI = {
  GIRIS: 'giris',
  CIKIS: 'cikis'
};

const StokHareketModal = ({
  acik,
  onKapat,
  urun,
  onHareketKaydet,
  mevcutStok = 0
}) => {
  const [miktar, setMiktar] = useState(1);
  const [aciklama, setAciklama] = useState('');
  const [hareketTipi, setHareketTipi] = useState(HAREKET_TIPLERI.GIRIS);
  const [yukleniyor, setYukleniyor] = useState(false);

  // Formu sıfırla
  const resetForm = () => {
    setMiktar(1);
    setAciklama('');
    setHareketTipi(HAREKET_TIPLERI.GIRIS);
  };

  // Stok hareketini kaydet
  const handleSubmit = async () => {
    if (miktar <= 0) return;

    // Çıkış işleminde mevcut stoktan fazla çıkış yapılmamalı
    if (hareketTipi === HAREKET_TIPLERI.CIKIS && miktar > mevcutStok) {
      alert('Çıkış miktarı mevcut stoktan fazla olamaz!');
      return;
    }

    setYukleniyor(true);
    try {
      await onHareketKaydet({
        urunId: urun.id,
        miktar: hareketTipi === HAREKET_TIPLERI.CIKIS ? -miktar : miktar,
        aciklama,
        tip: hareketTipi
      });
      onKapat();
      resetForm();
    } catch (error) {
      console.error('Stok hareketi kaydedilirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <Modal
      baslik="Stok Hareketi"
      acik={acik}
      onKapat={() => {
        onKapat();
        resetForm();
      }}
    >
      <div className="space-y-6">
        {/* Ürün Bilgileri */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Ürün Bilgileri</h4>
          <div className="text-sm text-gray-600">
            <p>Ürün: {urun?.ad}</p>
            <p>Mevcut Stok: {mevcutStok}</p>
            <p>Birim: {urun?.birim || 'Adet'}</p>
          </div>
        </div>

        {/* Hareket Tipi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hareket Tipi
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setHareketTipi(HAREKET_TIPLERI.GIRIS)}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                hareketTipi === HAREKET_TIPLERI.GIRIS
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Giriş
            </button>
            <button
              type="button"
              onClick={() => setHareketTipi(HAREKET_TIPLERI.CIKIS)}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                hareketTipi === HAREKET_TIPLERI.CIKIS
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MinusIcon className="w-5 h-5 mr-2" />
              Çıkış
            </button>
          </div>
        </div>

        {/* Miktar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Miktar
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setMiktar(prev => Math.max(1, prev - 1))}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              <MinusIcon className="w-5 h-5" />
            </button>
            <input
              type="number"
              min="1"
              value={miktar}
              onChange={(e) => setMiktar(Math.max(1, parseInt(e.target.value) || 0))}
              className="flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setMiktar(prev => prev + 1)}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            rows={3}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Stok hareketi ile ilgili açıklama..."
          />
        </div>

        {/* Uyarı Mesajı */}
        {hareketTipi === HAREKET_TIPLERI.CIKIS && miktar > mevcutStok && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <ExclamationIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Dikkat
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Çıkış miktarı mevcut stoktan fazla olamaz!
                    Mevcut stok: {mevcutStok}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              onKapat();
              resetForm();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={miktar <= 0 || yukleniyor || (hareketTipi === HAREKET_TIPLERI.CIKIS && miktar > mevcutStok)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {yukleniyor ? (
              <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <DocumentTextIcon className="w-5 h-5 mr-2" />
            )}
            Kaydet
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StokHareketModal; 