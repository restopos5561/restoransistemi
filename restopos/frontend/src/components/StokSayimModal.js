import React, { useState, useEffect } from 'react';
import {
  XMarkIcon as XIcon,
  ArrowUpTrayIcon as UploadIcon,
  ArrowDownTrayIcon as DownloadIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon as SearchIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  DocumentCheckIcon as SaveIcon
} from '@heroicons/react/24/outline';
import Modal from './Modal';

const StokSayimModal = ({
  acik,
  onKapat,
  urunler = [],
  onSayimKaydet
}) => {
  const [sayimUrunler, setSayimUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [farklar, setFarklar] = useState([]);

  // Ürünleri yükle
  useEffect(() => {
    setSayimUrunler(urunler.map(urun => ({
      ...urun,
      sayilanMiktar: urun.stokMiktari || 0
    })));
  }, [urunler]);

  // Farkları hesapla
  useEffect(() => {
    const yeniFarklar = sayimUrunler.filter(urun => 
      urun.sayilanMiktar !== urun.stokMiktari
    ).map(urun => ({
      urunId: urun.id,
      urunAd: urun.ad,
      eskiMiktar: urun.stokMiktari,
      yeniMiktar: urun.sayilanMiktar,
      fark: urun.sayilanMiktar - urun.stokMiktari
    }));
    setFarklar(yeniFarklar);
  }, [sayimUrunler]);

  // Sayılan miktarı güncelle
  const handleMiktarGuncelle = (urunId, yeniMiktar) => {
    setSayimUrunler(prev => prev.map(urun =>
      urun.id === urunId
        ? { ...urun, sayilanMiktar: Math.max(0, parseFloat(yeniMiktar) || 0) }
        : urun
    ));
  };

  // Sayımı kaydet
  const handleSubmit = async () => {
    if (farklar.length === 0) {
      alert('Hiçbir üründe fark bulunmamaktadır.');
      return;
    }

    setYukleniyor(true);
    try {
      await onSayimKaydet({
        farklar,
        aciklama,
        tarih: new Date()
      });
      onKapat();
    } catch (error) {
      console.error('Sayım kaydedilirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  // Filtrelenmiş ürünler
  const filtrelenenUrunler = sayimUrunler.filter(urun =>
    urun.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    urun.kategori?.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  return (
    <Modal
      baslik="Stok Sayımı"
      acik={acik}
      onKapat={onKapat}
      genislik="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Arama */}
        <div className="relative">
          <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Ürün Listesi */}
        <div className="h-[400px] overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mevcut Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sayılan Miktar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fark
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtrelenenUrunler.map(urun => {
                const fark = urun.sayilanMiktar - urun.stokMiktari;
                return (
                  <tr key={urun.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {urun.ad}
                        </div>
                        <div className="text-sm text-gray-500">
                          {urun.kategori}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {urun.stokMiktari} {urun.birim}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={urun.sayilanMiktar}
                        onChange={(e) => handleMiktarGuncelle(urun.id, e.target.value)}
                        className="w-24 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        fark === 0
                          ? 'text-gray-900'
                          : fark > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                      }`}>
                        {fark > 0 ? '+' : ''}{fark} {urun.birim}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Fark Özeti */}
        {farklar.length > 0 && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <ExclamationIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Stok Farkları Tespit Edildi
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    {farklar.length} üründe stok farkı bulundu.
                    Kaydetmeden önce kontrol ediniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Açıklama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            rows={3}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Sayım ile ilgili açıklama..."
          />
        </div>

        {/* Butonlar */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onKapat}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={farklar.length === 0 || yukleniyor}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {yukleniyor ? (
              <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <SaveIcon className="w-5 h-5 mr-2" />
            )}
            Sayımı Kaydet
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StokSayimModal; 