import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MinusIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  MagnifyingGlassIcon as SearchIcon,
  ArrowPathIcon as RefreshIcon,
  ArrowDownTrayIcon as DownloadIcon,
  ArrowUpTrayIcon as UploadIcon
} from '@heroicons/react/24/outline';

const STOK_DURUMLARI = {
  normal: 'bg-green-100 text-green-800',
  uyari: 'bg-yellow-100 text-yellow-800',
  kritik: 'bg-red-100 text-red-800'
};

const Stoklar = () => {
  // State tanımlamaları
  const [stoklar, setStoklar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const [filtrelenenKategori, setFiltrelenenKategori] = useState('tumu');
  const [stokHareketleri, setStokHareketleri] = useState([]);
  const [secilenStok, setSecilenStok] = useState(null);
  const [islemModalAcik, setIslemModalAcik] = useState(false);
  const [islemTipi, setIslemTipi] = useState('giris');

  // Stokları yükle
  const stoklariYukle = async () => {
    setYukleniyor(true);
    try {
      // API'den stokları çek
      // const data = await stokService.getStoklar();
      // setStoklar(data);
      
      // Mock data
      setStoklar([
        { id: 1, urunAd: 'Domates', miktar: 50, birim: 'kg', minStok: 20, kategori: 'sebze' },
        { id: 2, urunAd: 'Peynir', miktar: 15, birim: 'kg', minStok: 25, kategori: 'sut' },
        { id: 3, urunAd: 'Et', miktar: 30, birim: 'kg', minStok: 40, kategori: 'et' },
      ]);
    } catch (error) {
      console.error('Stoklar yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    stoklariYukle();
  }, []);

  // Stok durumunu hesapla
  const stokDurumunuHesapla = (stok) => {
    const oran = (stok.miktar / stok.minStok) * 100;
    if (oran <= 50) return 'kritik';
    if (oran <= 80) return 'uyari';
    return 'normal';
  };

  // Filtrelenmiş stoklar
  const filtrelenenStoklar = stoklar.filter(stok => {
    const aramaUyumu = stok.urunAd.toLowerCase().includes(aramaMetni.toLowerCase());
    const kategoriUyumu = filtrelenenKategori === 'tumu' || stok.kategori === filtrelenenKategori;
    return aramaUyumu && kategoriUyumu;
  });

  // Stok işlem modalı
  const StokIslemModal = () => {
    const [miktar, setMiktar] = useState('');
    const [aciklama, setAciklama] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!miktar || !secilenStok) return;

      try {
        const islemData = {
          stokId: secilenStok.id,
          miktar: Number(miktar),
          tip: islemTipi,
          aciklama
        };
        // await stokService.stokIslemEkle(islemData);
        console.log('Stok işlemi:', islemData);
        setIslemModalAcik(false);
        stoklariYukle();
      } catch (error) {
        console.error('Stok işlemi eklenirken hata:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            {islemTipi === 'giris' ? 'Stok Girişi' : 'Stok Çıkışı'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ürün
              </label>
              <input
                type="text"
                value={secilenStok?.urunAd || ''}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Miktar ({secilenStok?.birim})
              </label>
              <input
                type="number"
                value={miktar}
                onChange={(e) => setMiktar(e.target.value)}
                min="0"
                step="0.01"
                required
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <textarea
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIslemModalAcik(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stok Yönetimi</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={stoklariYukle}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <RefreshIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => {}} // Excel export fonksiyonu eklenecek
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Stok ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={filtrelenenKategori}
          onChange={(e) => setFiltrelenenKategori(e.target.value)}
          className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="tumu">Tüm Kategoriler</option>
          <option value="sebze">Sebzeler</option>
          <option value="meyve">Meyveler</option>
          <option value="et">Et Ürünleri</option>
          <option value="sut">Süt Ürünleri</option>
          <option value="icecek">İçecekler</option>
          <option value="diger">Diğer</option>
        </select>
      </div>

      {/* Stok Listesi */}
      {yukleniyor ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miktar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtrelenenStoklar.map(stok => {
                const durumRengi = STOK_DURUMLARI[stokDurumunuHesapla(stok)];
                return (
                  <tr key={stok.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {stok.urunAd}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {stok.kategori}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {stok.miktar} {stok.birim}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${durumRengi}`}>
                        {stok.miktar <= stok.minStok && (
                          <ExclamationIcon className="w-4 h-4 mr-1" />
                        )}
                        {stok.miktar} / {stok.minStok} {stok.birim}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSecilenStok(stok);
                          setIslemTipi('giris');
                          setIslemModalAcik(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSecilenStok(stok);
                          setIslemTipi('cikis');
                          setIslemModalAcik(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MinusIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtrelenenStoklar.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Stok bulunamadı
            </div>
          )}
        </div>
      )}

      {/* Stok İşlem Modalı */}
      {islemModalAcik && <StokIslemModal />}
    </div>
  );
};

export default Stoklar; 