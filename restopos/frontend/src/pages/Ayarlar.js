import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  CogIcon,
  PrinterIcon,
  ServerIcon,
  BellIcon,
  SwatchIcon,
  ArrowDownTrayIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const AYAR_KATEGORILERI = {
  kullanici: {
    baslik: 'Kullanıcı Ayarları',
    icon: UserIcon
  },
  sistem: {
    baslik: 'Sistem Ayarları',
    icon: CogIcon
  },
  yazici: {
    baslik: 'Yazıcı Ayarları',
    icon: PrinterIcon
  },
  veritabani: {
    baslik: 'Veritabanı Ayarları',
    icon: ServerIcon
  },
  bildirimler: {
    baslik: 'Bildirim Ayarları',
    icon: BellIcon
  },
  tema: {
    baslik: 'Tema Ayarları',
    icon: SwatchIcon
  }
};

const Ayarlar = () => {
  // State tanımlamaları
  const [yukleniyor, setYukleniyor] = useState(false);
  const [secilenKategori, setSecilenKategori] = useState('kullanici');
  const [ayarlar, setAyarlar] = useState({
    kullanici: {
      ad: '',
      email: '',
      dil: 'tr',
      bildirimler: true
    },
    sistem: {
      restoranAdi: '',
      adres: '',
      telefon: '',
      vergiDairesi: '',
      vergiNo: ''
    },
    yazici: {
      faturaPrinter: '',
      mutfakPrinter: '',
      makbuzBoyutu: 'A4'
    },
    veritabani: {
      yedeklemeOtomatik: true,
      yedeklemeSikligi: 'gunluk',
      sonYedekleme: ''
    },
    bildirimler: {
      masaUyarilari: true,
      stokUyarilari: true,
      siparisUyarilari: true
    },
    tema: {
      renkSemasi: 'light',
      fontBoyutu: 'normal'
    }
  });

  // Ayarları yükle
  const ayarlariYukle = async () => {
    setYukleniyor(true);
    try {
      // API'den ayarları çek
      // const data = await ayarService.getAyarlar();
      // setAyarlar(data);
      
      // Mock data zaten state'de tanıml��
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    ayarlariYukle();
  }, []);

  // Form değişikliklerini işle
  const handleChange = (kategori, alan, deger) => {
    setAyarlar(prev => ({
      ...prev,
      [kategori]: {
        ...prev[kategori],
        [alan]: deger
      }
    }));
  };

  // Ayarları kaydet
  const handleSubmit = async (e) => {
    e.preventDefault();
    setYukleniyor(true);
    try {
      // await ayarService.updateAyarlar(ayarlar);
      console.log('Ayarlar güncellendi:', ayarlar);
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  // Şifre değiştirme modalı
  const SifreDegistirModal = () => {
    const [sifreForm, setSifreForm] = useState({
      eskiSifre: '',
      yeniSifre: '',
      yeniSifreTekrar: ''
    });

    const handleSifreChange = (e) => {
      const { name, value } = e.target;
      setSifreForm(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSifreSubmit = async (e) => {
      e.preventDefault();
      if (sifreForm.yeniSifre !== sifreForm.yeniSifreTekrar) {
        alert('Yeni şifreler eşleşmiyor!');
        return;
      }
      try {
        // await authService.updatePassword(sifreForm);
        console.log('Şifre güncellendi');
      } catch (error) {
        console.error('Şifre güncellenirken hata:', error);
      }
    };

    return (
      <form onSubmit={handleSifreSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mevcut Şifre
          </label>
          <input
            type="password"
            name="eskiSifre"
            value={sifreForm.eskiSifre}
            onChange={handleSifreChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Yeni Şifre
          </label>
          <input
            type="password"
            name="yeniSifre"
            value={sifreForm.yeniSifre}
            onChange={handleSifreChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Yeni Şifre (Tekrar)
          </label>
          <input
            type="password"
            name="yeniSifreTekrar"
            value={sifreForm.yeniSifreTekrar}
            onChange={handleSifreChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Şifreyi Güncelle
          </button>
        </div>
      </form>
    );
  };

  // Ayar formlarını render et
  const renderAyarFormu = () => {
    switch (secilenKategori) {
      case 'kullanici':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={ayarlar.kullanici.ad}
                  onChange={(e) => handleChange('kullanici', 'ad', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <input
                  type="email"
                  value={ayarlar.kullanici.email}
                  onChange={(e) => handleChange('kullanici', 'email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dil
                </label>
                <select
                  value={ayarlar.kullanici.dil}
                  onChange={(e) => handleChange('kullanici', 'dil', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={ayarlar.kullanici.bildirimler}
                    onChange={(e) => handleChange('kullanici', 'bildirimler', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Bildirimleri aktif et</span>
                </label>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Şifre Değiştir
              </h3>
              <SifreDegistirModal />
            </div>
          </div>
        );

      case 'sistem':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Restoran Adı
              </label>
              <input
                type="text"
                value={ayarlar.sistem.restoranAdi}
                onChange={(e) => handleChange('sistem', 'restoranAdi', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adres
              </label>
              <textarea
                value={ayarlar.sistem.adres}
                onChange={(e) => handleChange('sistem', 'adres', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                type="tel"
                value={ayarlar.sistem.telefon}
                onChange={(e) => handleChange('sistem', 'telefon', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vergi Dairesi
              </label>
              <input
                type="text"
                value={ayarlar.sistem.vergiDairesi}
                onChange={(e) => handleChange('sistem', 'vergiDairesi', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vergi No
              </label>
              <input
                type="text"
                value={ayarlar.sistem.vergiNo}
                onChange={(e) => handleChange('sistem', 'vergiNo', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'yazici':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fatura Yazıcısı
              </label>
              <select
                value={ayarlar.yazici.faturaPrinter}
                onChange={(e) => handleChange('yazici', 'faturaPrinter', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Yazıcı Seçin</option>
                <option value="printer1">Yazıcı 1</option>
                <option value="printer2">Yazıcı 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mutfak Yazıcısı
              </label>
              <select
                value={ayarlar.yazici.mutfakPrinter}
                onChange={(e) => handleChange('yazici', 'mutfakPrinter', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Yazıcı Seçin</option>
                <option value="printer1">Yazıcı 1</option>
                <option value="printer2">Yazıcı 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Makbuz Boyutu
              </label>
              <select
                value={ayarlar.yazici.makbuzBoyutu}
                onChange={(e) => handleChange('yazici', 'makbuzBoyutu', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="A4">A4</option>
                <option value="80mm">80mm</option>
                <option value="58mm">58mm</option>
              </select>
            </div>
          </div>
        );

      case 'veritabani':
        return (
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={ayarlar.veritabani.yedeklemeOtomatik}
                  onChange={(e) => handleChange('veritabani', 'yedeklemeOtomatik', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Otomatik yedekleme</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Yedekleme Sıklığı
              </label>
              <select
                value={ayarlar.veritabani.yedeklemeSikligi}
                onChange={(e) => handleChange('veritabani', 'yedeklemeSikligi', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="gunluk">Günlük</option>
                <option value="haftalik">Haftalık</option>
                <option value="aylik">Aylık</option>
              </select>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Son yedekleme: {ayarlar.veritabani.sonYedekleme || 'Henüz yedekleme yapılmadı'}
              </p>
            </div>

            <div>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => {
                  // Manuel yedekleme işlemi
                  console.log('Manuel yedekleme başlatıldı');
                }}
              >
                Manuel Yedekleme Al
              </button>
            </div>
          </div>
        );

      case 'bildirimler':
        return (
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={ayarlar.bildirimler.masaUyarilari}
                  onChange={(e) => handleChange('bildirimler', 'masaUyarilari', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Masa uyarıları</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={ayarlar.bildirimler.stokUyarilari}
                  onChange={(e) => handleChange('bildirimler', 'stokUyarilari', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Stok uyarıları</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={ayarlar.bildirimler.siparisUyarilari}
                  onChange={(e) => handleChange('bildirimler', 'siparisUyarilari', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Sipariş uyarıları</span>
              </label>
            </div>
          </div>
        );

      case 'tema':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Renk Şeması
              </label>
              <select
                value={ayarlar.tema.renkSemasi}
                onChange={(e) => handleChange('tema', 'renkSemasi', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="light">Açık Tema</option>
                <option value="dark">Koyu Tema</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Font Boyutu
              </label>
              <select
                value={ayarlar.tema.fontBoyutu}
                onChange={(e) => handleChange('tema', 'fontBoyutu', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="small">Küçük</option>
                <option value="normal">Normal</option>
                <option value="large">Büyük</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ayarlar</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Kategori Menüsü */}
        <div className="space-y-2">
          {Object.entries(AYAR_KATEGORILERI).map(([key, { baslik, icon: Icon }]) => (
            <button
              key={key}
              onClick={() => setSecilenKategori(key)}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                secilenKategori === key
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{baslik}</span>
            </button>
          ))}
        </div>

        {/* Ayar İçeriği */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              {AYAR_KATEGORILERI[secilenKategori].baslik}
            </h2>

            <form onSubmit={handleSubmit}>
              {renderAyarFormu()}

              <div className="mt-6 pt-6 border-t flex justify-end">
                <button
                  type="submit"
                  disabled={yukleniyor}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  <span>Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ayarlar; 