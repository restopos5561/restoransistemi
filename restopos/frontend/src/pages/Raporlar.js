import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ChartPieIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon as DownloadIcon,
  ArrowPathIcon as RefreshIcon,
  BanknotesIcon as CashIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  BuildingStorefrontIcon as StoreIcon,
  FunnelIcon as FilterIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const RAPOR_TIPLERI = {
  gunluk: 'Günlük',
  haftalik: 'Haftalık',
  aylik: 'Aylık',
  yillik: 'Yıllık',
  ozel: 'Özel Tarih'
};

const Raporlar = () => {
  // State tanımlamaları
  const [yukleniyor, setYukleniyor] = useState(false);
  const [secilenRaporTipi, setSecilenRaporTipi] = useState('gunluk');
  const [secilenKategori, setSecilenKategori] = useState('satis');
  const [baslangicTarihi, setBaslangicTarihi] = useState('');
  const [bitisTarihi, setBitisTarihi] = useState('');
  const [raporData, setRaporData] = useState(null);

  // Rapor verilerini yükle
  const raporlariYukle = async () => {
    setYukleniyor(true);
    try {
      // API'den rapor verilerini çek
      // const data = await raporService.getRaporlar({
      //   tip: secilenRaporTipi,
      //   kategori: secilenKategori,
      //   baslangicTarihi,
      //   bitisTarihi
      // });
      // setRaporData(data);
      
      // Mock data
      setRaporData({
        toplamSatis: 15750.50,
        toplamSiparis: 124,
        ortalamaFiyat: 127.02,
        enCokSatanUrunler: [
          { urunAd: 'Karışık Pizza', miktar: 45, tutar: 2250 },
          { urunAd: 'Cola 330ml', miktar: 78, tutar: 780 },
          { urunAd: 'Tavuk Şiş', miktar: 32, tutar: 1920 }
        ],
        saatlikDagilim: [
          { saat: '12:00', siparis: 15, tutar: 1875 },
          { saat: '13:00', siparis: 22, tutar: 2750 },
          { saat: '14:00', siparis: 18, tutar: 2250 }
        ]
      });
    } catch (error) {
      console.error('Raporlar yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  // Tarih değişikliklerinde raporu güncelle
  useEffect(() => {
    if (secilenRaporTipi !== 'ozel') {
      raporlariYukle();
    }
  }, [secilenRaporTipi, secilenKategori]);

  // Özel tarih seçiminde raporu güncelle
  const handleOzelTarihRaporu = () => {
    if (baslangicTarihi && bitisTarihi) {
      raporlariYukle();
    }
  };

  // Excel export fonksiyonu
  const handleExcelExport = () => {
    // Excel export işlemi
    console.log('Excel export başlatıldı');
  };

  // Özet Kartları
  const OzetKart = ({ baslik, deger, icon: Icon, renk }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{baslik}</p>
          <p className="text-2xl font-semibold mt-1">{deger}</p>
        </div>
        <div className={`p-3 rounded-full ${renk}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Raporlar</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={raporlariYukle}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <RefreshIcon className="w-5 h-5" />
          </button>

          <button
            onClick={handleExcelExport}
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={secilenKategori}
          onChange={(e) => setSecilenKategori(e.target.value)}
          className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="satis">Satış Raporu</option>
          <option value="stok">Stok Raporu</option>
          <option value="personel">Personel Raporu</option>
        </select>

        <select
          value={secilenRaporTipi}
          onChange={(e) => setSecilenRaporTipi(e.target.value)}
          className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.entries(RAPOR_TIPLERI).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>

        {secilenRaporTipi === 'ozel' && (
          <>
            <input
              type="date"
              value={baslangicTarihi}
              onChange={(e) => setBaslangicTarihi(e.target.value)}
              className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="date"
              value={bitisTarihi}
              onChange={(e) => setBitisTarihi(e.target.value)}
              className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </>
        )}

        {secilenRaporTipi === 'ozel' && (
          <button
            onClick={handleOzelTarihRaporu}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FilterIcon className="w-5 h-5 mr-2" />
            <span>Filtrele</span>
          </button>
        )}
      </div>

      {/* Rapor İçeriği */}
      {yukleniyor ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : raporData ? (
        <div className="space-y-6">
          {/* Özet Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <OzetKart
              baslik="Toplam Satış"
              deger={`${raporData.toplamSatis.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`}
              icon={CashIcon}
              renk="bg-green-500"
            />
            <OzetKart
              baslik="Toplam Sipariş"
              deger={raporData.toplamSiparis}
              icon={ChartBarIcon}
              renk="bg-blue-500"
            />
            <OzetKart
              baslik="Ortalama Fiyat"
              deger={`${raporData.ortalamaFiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`}
              icon={CalendarIcon}
              renk="bg-purple-500"
            />
          </div>

          {/* En Çok Satan Ürünler */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">En Çok Satan Ürünler</h2>
            </div>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ürün
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miktar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {raporData.enCokSatanUrunler.map((urun, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {urun.urunAd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {urun.miktar}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {urun.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Saatlik Dağılım */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Saatlik Dağılım</h2>
            </div>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sipariş Sayısı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {raporData.saatlikDagilim.map((saat, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {saat.saat}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {saat.siparis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {saat.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Rapor verisi bulunamadı
        </div>
      )}
    </div>
  );
};

export default Raporlar; 