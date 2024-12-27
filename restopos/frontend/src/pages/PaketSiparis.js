import React, { useState, useEffect } from 'react';
import { useUrun } from '../context/UrunContext';
import { useSiparis } from '../context/SiparisContext';
import {
  PlusIcon,
  MagnifyingGlassIcon as SearchIcon,
  ArrowPathIcon as RefreshIcon,
  PhoneIcon,
  MapPinIcon as LocationIcon,
  ClockIcon,
  BanknotesIcon as CashIcon,
  MinusIcon,
  TrashIcon,
  TruckIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const PaketSiparis = () => {
  const { urunler, getUrunler } = useUrun();
  const { createPaketSiparis, yukleniyor } = useSiparis();
  
  // State tanımlamaları
  const [secilenUrunler, setSecilenUrunler] = useState([]);
  const [aramaMetni, setAramaMetni] = useState('');
  const [toplamTutar, setToplamTutar] = useState(0);
  const [musteriForm, setMusteriForm] = useState({
    ad: '',
    telefon: '',
    adres: '',
    not: ''
  });
  const [odemeYontemi, setOdemeYontemi] = useState('nakit');
  
  // Ürünleri yükle
  useEffect(() => {
    getUrunler();
  }, [getUrunler]);

  // Toplam tutarı hesapla
  useEffect(() => {
    const yeniToplam = secilenUrunler.reduce((toplam, urun) => {
      return toplam + (urun.fiyat * urun.miktar);
    }, 0);
    setToplamTutar(yeniToplam);
  }, [secilenUrunler]);

  // Form değişikliklerini işle
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMusteriForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ürün arama
  const filtrelenenUrunler = urunler.filter(urun => 
    urun.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    urun.kategori?.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  // Ürün ekleme
  const handleUrunEkle = (urun) => {
    setSecilenUrunler(prev => {
      const mevcutUrun = prev.find(item => item.id === urun.id);
      if (mevcutUrun) {
        return prev.map(item => 
          item.id === urun.id 
            ? { ...item, miktar: item.miktar + 1 }
            : item
        );
      }
      return [...prev, { ...urun, miktar: 1 }];
    });
  };

  // Ürün miktarını artır
  const handleMiktarArtir = (urunId) => {
    setSecilenUrunler(prev => 
      prev.map(item => 
        item.id === urunId 
          ? { ...item, miktar: item.miktar + 1 }
          : item
      )
    );
  };

  // Ürün miktarını azalt
  const handleMiktarAzalt = (urunId) => {
    setSecilenUrunler(prev => {
      const guncelListe = prev.map(item => {
        if (item.id === urunId) {
          const yeniMiktar = item.miktar - 1;
          return yeniMiktar > 0 
            ? { ...item, miktar: yeniMiktar }
            : null;
        }
        return item;
      }).filter(Boolean);
      return guncelListe;
    });
  };

  // Ürünü kaldır
  const handleUrunKaldir = (urunId) => {
    setSecilenUrunler(prev => prev.filter(item => item.id !== urunId));
  };

  // Form validasyonu
  const validateForm = () => {
    const { ad, telefon, adres } = musteriForm;
    if (!ad.trim()) return 'Müşteri adı gerekli';
    if (!telefon.trim()) return 'Telefon numarası gerekli';
    if (!adres.trim()) return 'Teslimat adresi gerekli';
    if (secilenUrunler.length === 0) return 'En az bir ürün seçilmeli';
    return null;
  };

  // Siparişi tamamla
  const handleSiparisTamamla = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const siparisData = {
        musteri: musteriForm,
        urunler: secilenUrunler.map(urun => ({
          urunId: urun.id,
          miktar: urun.miktar,
          birimFiyat: urun.fiyat
        })),
        odemeYontemi,
        toplamTutar,
        tip: 'paket'
      };

      await createPaketSiparis(siparisData);
      // Formu sıfırla
      setSecilenUrunler([]);
      setToplamTutar(0);
      setMusteriForm({
        ad: '',
        telefon: '',
        adres: '',
        not: ''
      });
    } catch (error) {
      console.error('Sipariş oluşturma hatası:', error);
      alert('Sipariş oluşturulurken bir hata oluştu');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Paket Sipariş</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Panel - Ürün Listesi */}
        <div className="space-y-4">
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[600px] overflow-y-auto">
            {filtrelenenUrunler.map(urun => (
              <button
                key={urun.id}
                onClick={() => handleUrunEkle(urun)}
                className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 
                  hover:bg-blue-50 transition-colors text-left space-y-1"
              >
                <div className="font-medium text-gray-900">{urun.ad}</div>
                <div className="text-sm text-gray-600">{urun.kategori}</div>
                <div className="text-blue-600 font-semibold">
                  ₺{urun.fiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sağ Panel - Müşteri Bilgileri ve Seçilen Ürünler */}
        <div className="space-y-4">
          {/* Müşteri Bilgileri Formu */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <h2 className="font-semibold text-lg text-gray-900">Müşteri Bilgileri</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Müşteri Adı
                </label>
                <div className="mt-1 relative">
                  <UserIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="ad"
                    value={musteriForm.ad}
                    onChange={handleFormChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ad Soyad"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <div className="mt-1 relative">
                  <PhoneIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="telefon"
                    value={musteriForm.telefon}
                    onChange={handleFormChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0(5XX) XXX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teslimat Adresi
                </label>
                <div className="mt-1 relative">
                  <LocationIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <textarea
                    name="adres"
                    value={musteriForm.adres}
                    onChange={handleFormChange}
                    rows={3}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Açık adres..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sipariş Notu
                </label>
                <textarea
                  name="not"
                  value={musteriForm.not}
                  onChange={handleFormChange}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Özel istekler, notlar..."
                />
              </div>
            </div>
          </div>

          {/* Seçilen Ürünler */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <h2 className="font-semibold text-lg text-gray-900">Seçilen Ürünler</h2>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {secilenUrunler.map(urun => (
                <div 
                  key={urun.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{urun.ad}</div>
                    <div className="text-sm text-gray-600">
                      Birim Fiyat: ₺{urun.fiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMiktarAzalt(urun.id)}
                      className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {urun.miktar}
                    </span>
                    <button
                      onClick={() => handleMiktarArtir(urun.id)}
                      className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleUrunKaldir(urun.id)}
                      className="p-1 rounded-lg text-red-400 hover:bg-red-50 ml-2"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {secilenUrunler.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Henüz ürün seçilmedi
                </div>
              )}
            </div>

            {/* Ödeme Bilgileri */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Toplam Tutar:</span>
                <span className="text-blue-600">
                  ₺{toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ödeme Yöntemi
                </label>
                <select
                  value={odemeYontemi}
                  onChange={(e) => setOdemeYontemi(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="nakit">Nakit</option>
                  <option value="krediKarti">Kredi Kartı</option>
                  <option value="yemekKarti">Yemek Kartı</option>
                </select>
              </div>

              <button
                onClick={handleSiparisTamamla}
                disabled={yukleniyor || secilenUrunler.length === 0}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                  disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <TruckIcon className="w-5 h-5" />
                <span>{yukleniyor ? 'İşleniyor...' : 'Siparişi Tamamla'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaketSiparis; 