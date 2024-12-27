import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon as SearchIcon,
  ArrowPathIcon as RefreshIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon as MailIcon,
  MapPinIcon as LocationIcon,
  BanknotesIcon as CashIcon,
  ArrowDownTrayIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const CARI_TIPLERI = {
  musteri: 'Müşteri',
  tedarikci: 'Tedarikçi'
};

const Cariler = () => {
  // State tanımlamaları
  const [cariler, setCariler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [aramaMetni, setAramaMetni] = useState('');
  const [filtrelenenTip, setFiltrelenenTip] = useState('tumu');
  const [modalAcik, setModalAcik] = useState(false);
  const [secilenCari, setSecilenCari] = useState(null);
  const [cariForm, setCariForm] = useState({
    ad: '',
    tip: 'musteri',
    telefon: '',
    email: '',
    adres: '',
    vergiDairesi: '',
    vergiNo: '',
    notlar: ''
  });

  // Carileri yükle
  const carileriYukle = async () => {
    setYukleniyor(true);
    try {
      // API'den carileri çek
      // const data = await cariService.getCariler();
      // setCariler(data);
      
      // Mock data
      setCariler([
        { 
          id: 1, 
          ad: 'Ahmet Yılmaz', 
          tip: 'musteri',
          telefon: '0555 111 2233',
          email: 'ahmet@mail.com',
          adres: 'İstanbul',
          vergiDairesi: '',
          vergiNo: '',
          bakiye: 150
        },
        { 
          id: 2, 
          ad: 'ABC Gıda Ltd. Şti.', 
          tip: 'tedarikci',
          telefon: '0212 333 4455',
          email: 'info@abcgida.com',
          adres: 'Ankara',
          vergiDairesi: 'Çankaya',
          vergiNo: '1234567890',
          bakiye: -2500
        }
      ]);
    } catch (error) {
      console.error('Cariler yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    carileriYukle();
  }, []);

  // Filtrelenmiş cariler
  const filtrelenenCariler = cariler.filter(cari => {
    const aramaUyumu = cari.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
                      cari.telefon.includes(aramaMetni) ||
                      cari.email.toLowerCase().includes(aramaMetni.toLowerCase());
    const tipUyumu = filtrelenenTip === 'tumu' || cari.tip === filtrelenenTip;
    return aramaUyumu && tipUyumu;
  });

  // Form değişikliklerini işle
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCariForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cari kaydet
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (secilenCari) {
        // Güncelleme
        // await cariService.updateCari(secilenCari.id, cariForm);
        console.log('Cari güncellendi:', { id: secilenCari.id, ...cariForm });
      } else {
        // Yeni kayıt
        // await cariService.createCari(cariForm);
        console.log('Yeni cari oluşturuldu:', cariForm);
      }
      setModalAcik(false);
      carileriYukle();
    } catch (error) {
      console.error('Cari kaydedilirken hata:', error);
    }
  };

  // Cari sil
  const handleDelete = async (id) => {
    if (!window.confirm('Bu cariyi silmek istediğinize emin misiniz?')) return;

    try {
      // await cariService.deleteCari(id);
      console.log('Cari silindi:', id);
      carileriYukle();
    } catch (error) {
      console.error('Cari silinirken hata:', error);
    }
  };

  // Yeni cari modalını aç
  const handleYeniCari = () => {
    setSecilenCari(null);
    setCariForm({
      ad: '',
      tip: 'musteri',
      telefon: '',
      email: '',
      adres: '',
      vergiDairesi: '',
      vergiNo: '',
      notlar: ''
    });
    setModalAcik(true);
  };

  // Cari düzenle
  const handleDuzenle = (cari) => {
    setSecilenCari(cari);
    setCariForm({
      ad: cari.ad,
      tip: cari.tip,
      telefon: cari.telefon,
      email: cari.email,
      adres: cari.adres,
      vergiDairesi: cari.vergiDairesi || '',
      vergiNo: cari.vergiNo || '',
      notlar: cari.notlar || ''
    });
    setModalAcik(true);
  };

  // Cari Modal Bileşeni
  const CariModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          {secilenCari ? 'Cari Düzenle' : 'Yeni Cari'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cari Adı
              </label>
              <input
                type="text"
                name="ad"
                value={cariForm.ad}
                onChange={handleFormChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cari Tipi
              </label>
              <select
                name="tip"
                value={cariForm.tip}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                {Object.entries(CARI_TIPLERI).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                type="tel"
                name="telefon"
                value={cariForm.telefon}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                value={cariForm.email}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Adres
              </label>
              <textarea
                name="adres"
                value={cariForm.adres}
                onChange={handleFormChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {cariForm.tip === 'tedarikci' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vergi Dairesi
                  </label>
                  <input
                    type="text"
                    name="vergiDairesi"
                    value={cariForm.vergiDairesi}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vergi No
                  </label>
                  <input
                    type="text"
                    name="vergiNo"
                    value={cariForm.vergiNo}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Notlar
              </label>
              <textarea
                name="notlar"
                value={cariForm.notlar}
                onChange={handleFormChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setModalAcik(false)}
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cari Hesaplar</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={carileriYukle}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <RefreshIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => {}} // Excel export fonksiyonu eklenecek
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>

          <button
            onClick={handleYeniCari}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlusIcon className="h-5 w-5" />
            <span>Yeni Cari</span>
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={filtrelenenTip}
          onChange={(e) => setFiltrelenenTip(e.target.value)}
          className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="tumu">Tüm Cariler</option>
          <option value="musteri">Müşteriler</option>
          <option value="tedarikci">Tedarikçiler</option>
        </select>
      </div>

      {/* Cari Listesi */}
      {yukleniyor ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrelenenCariler.map(cari => (
            <div 
              key={cari.id}
              className="bg-white rounded-lg shadow p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{cari.ad}</h3>
                  <span className="text-sm text-gray-500">
                    {CARI_TIPLERI[cari.tip]}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDuzenle(cari)}
                    className="p-1 rounded-lg text-blue-600 hover:bg-blue-50"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cari.id)}
                    className="p-1 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {cari.telefon && (
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {cari.telefon}
                  </div>
                )}
                {cari.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MailIcon className="w-4 h-4 mr-2" />
                    {cari.email}
                  </div>
                )}
                {cari.adres && (
                  <div className="flex items-center text-sm text-gray-600">
                    <LocationIcon className="w-4 h-4 mr-2" />
                    {cari.adres}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Bakiye</span>
                  <span className={`text-lg font-semibold ${cari.bakiye >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <CashIcon className="w-5 h-5 inline-block mr-1" />
                    {cari.bakiye.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filtrelenenCariler.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Cari bulunamadı
            </div>
          )}
        </div>
      )}

      {/* Cari Modalı */}
      {modalAcik && <CariModal />}
    </div>
  );
};

export default Cariler; 